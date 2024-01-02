import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user.model";
import uploadOnCloudinary from "../utils/cloudinary";
import ApiResponse from "../utils/ApiResponse";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: true,
};

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    //@ts-ignore
    const accessToken = user.generateAccessToken();
    //@ts-ignore
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
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username, email }] });
  if (existedUser) throw new ApiError(409, "Username or email already exists");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageExists = req.files?.coverImage ? true : false;
  const coverImageLocalPath = coverImageExists
    ? req.files?.coverImage[0]?.path
    : "";

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageExists
    ? await uploadOnCloudinary(coverImageLocalPath)
    : { url: "" };

  if (!avatar)
    throw new ApiError(500, "Error while uploading files on cloudinary");

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

  if (!createdUser) throw new ApiError(500, "Error while creating user");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { username, password, email } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  if (!password) throw new ApiError(400, "Password is required");

  const user = await User.findOne({
    $or: [{ username: username?.toLowerCase() }, { email }],
  });

  if (!user) throw new ApiError(404, "User not found");

  //@ts-ignore
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  res
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

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  const { refreshToken: refreshTokenFromReq } = req.body;
  const incomingRefreshToken = refreshTokenFromReq || refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

  try {
    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
  
    if (!user) throw new ApiError(401, "Invalid refresh token");
  
    if (user?.refreshToken !== incomingRefreshToken)
      throw new ApiError(401, "Refresh token is invalid");
  
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      user._id
    );
  
    res
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
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
