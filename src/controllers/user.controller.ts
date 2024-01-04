import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import ApiResponse from "../utils/ApiResponse";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const options = {
  httpOnly: true,
  secure: true,
};

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { fullname, email, password, username } = req.body;

  if ([fullname, email, password, username].some((arg) => arg?.trim() === "")) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const existedUser = await User.findOne({ $or: [{ username, email }] });
  if (existedUser) {
    return res
      .status(409)
      .json(new ApiError(409, "Username or email already exists"));
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageExists = req.files?.coverImage ? true : false;
  const coverImageLocalPath = coverImageExists
    ? req.files?.coverImage[0]?.path
    : "";

  if (!avatarLocalPath) {
    return res.status(400).json(new ApiError(400, "Avatar is required"));
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageExists
    ? await uploadOnCloudinary(coverImageLocalPath)
    : { url: "" };

  if (!avatar) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while uploading files on cloudinary"));
  }

  const user = await User.create({
    fullname,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return res.status(500).json(new ApiError(500, "Error while creating user"));
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { username, password, email } = req.body;

  if (!username && !email) {
    return res
      .status(400)
      .json(new ApiError(400, "Username or email is required"));
  }

  if (!password) {
    return res.status(400).json(new ApiError(400, "Password is required"));
  }

  const user = await User.findOne({
    $or: [{ username: username?.toLowerCase() }, { email }],
  });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401).json(new ApiError(401, "Invalid credentials"));
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  const userID = req.user._id;

  await User.findByIdAndUpdate(
    userID,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  const { refreshToken: refreshTokenFromReq } = req.body;
  const incomingRefreshToken = refreshTokenFromReq || refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json(new ApiError(401, "Unauthorized request"));
  }

  try {
    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json(new ApiError(401, "Invalid refresh token"));
    }

    if (user?.refreshToken !== incomingRefreshToken) {
      return res
        .status(401)
        .json(new ApiError(401, "Refresh token is invalid"));
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    return res
      .status(401)
      .json(new ApiError(401, error?.message || "Invalid refresh token"));
  }
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const { _id } = req.user;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json(new ApiError(400, "Current and new password are required"));
  }

  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  const isPasswordValid = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordValid) {
    return res.status(401).json(new ApiError(401, "Invalid old password"));
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res, next) => {
  const { fullname, email, username } = req.body;

  if ([fullname, email, username].some((arg) => arg?.trim() === "")) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullname,
        email,
        username,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    return res.status(500).json(new ApiError(500, "Error while updating user"));
  }

  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    return res.status(400).json(new ApiError(400, "Avatar is required"));
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while uploading files on cloudinary"));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    return res.status(500).json(new ApiError(500, "Error while updating user"));
  }

  const oldAvatar = req.user?.avatar;
  const publicId = oldAvatar?.split("/")[7]?.split(".")[0];
  const deleteOldAvatar = await deleteFromCloudinary(publicId);

  if (!deleteOldAvatar) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while deleting old avatar"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res, next) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    return res.status(400).json(new ApiError(400, "Cover image is required"));
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while uploading files on cloudinary"));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    return res.status(500).json(new ApiError(500, "Error while updating user"));
  }

  const oldCoverImage = req.user?.coverImage;
  const publicId = oldCoverImage?.split("/")[7]?.split(".")[0];
  const deleteOldCoverImage = await deleteFromCloudinary(publicId);
  console.log(deleteOldCoverImage);

  if (!deleteOldCoverImage) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while deleting old cover image"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  if (!username?.trim()) {
    return res.status(400).json(new ApiError(400, "Username is required"));
  }

  const channel = await User.aggregate([
    {
      $match: { username: username.toLowerCase() },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  console.log("channelAggrigate: ", channel);

  if (!channel?.length) {
    return res.status(404).json(new ApiError(404, "Channel does not exists"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res, next) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, user[0], "Watch history fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
