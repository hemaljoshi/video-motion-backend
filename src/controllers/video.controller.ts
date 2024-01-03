import { Video } from "../models/video.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

const addVideo = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const localVideoPath = req.files?.videoFile[0]?.path;
  if (!localVideoPath) throw new ApiError(400, "Video is required");
  const videoFile = await uploadOnCloudinary(localVideoPath);
  if (!videoFile.url)
    throw new ApiError(500, "Error while uploading video on cloudinary");

  console.log("video: ", videoFile);

  const localThumbnailPath = req.files?.thumbnail[0]?.path;
  if (!localThumbnailPath) throw new ApiError(400, "Thumbnail is required");
  const thumbnail = await uploadOnCloudinary(localThumbnailPath);
  if (!thumbnail.url)
    throw new ApiError(500, "Error while uploading thumbnail on cloudinray");

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title: title,
    description: description,
    duration: videoFile.duration,
    owner: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

export { addVideo };
