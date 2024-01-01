import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user.model";
import uploadOnCloudinary from "../utils/cloudinary";
import ApiResponse from "../utils/ApiResponse";

const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, username } = req.body;

  if ([fullName, email, password, username].some((arg) => arg?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({ $or: [{ username, email }] });
  if (existedUser) throw new ApiError(409, "Username or email already exists");

  console.log("filesRes: ", req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  console.log("avatar: ", avatar);
  console.log("coverImage: ", coverImage);

  if (!avatar)
    throw new ApiError(500, "Error while uploading files on cloudinary");

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

    if (!createdUser) throw new ApiError(500, "Error while creating user");
    
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    );
});

export default registerUser;
