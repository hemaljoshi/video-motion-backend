import { User } from "../models/user.model";
import { Video } from "../models/video.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

const publishVideo = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const localVideoPath = req.files?.videoFile[0]?.path;
  if (!localVideoPath) {
    return res.status(400).json(new ApiError(400, "Video is required"));
  }
  const videoFile = await uploadOnCloudinary(localVideoPath);
  if (!videoFile.url) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while uploading video on cloudinary"));
  }

  const localThumbnailPath = req.files?.thumbnail[0]?.path;
  if (!localThumbnailPath) {
    return res.status(400).json(new ApiError(400, "Thumbnail is required"));
  }
  const thumbnail = await uploadOnCloudinary(localThumbnailPath);
  if (!thumbnail.url) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while uploading thumbnail on cloudinray"));
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title: title,
    description: description,
    duration: videoFile.duration,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

const increaseViewCount = asyncHandler(async (req, res, next) => {
  const videoID = req.params.videoId;

  if (!videoID) {
    return res.status(400).json(new ApiError(400, "Video id is required"));
  }

  const video = await Video.findByIdAndUpdate(
    videoID,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "View count incremented successfully"));
});

const addVideoToWatchHistory = asyncHandler(async (req, res, next) => {
  const videoID = req.params.videoId;
  const { duration } = req.body;

  if (!videoID) {
    return res.status(400).json(new ApiError(400, "Video id is required"));
  }

  if (!duration) {
    return res.status(400).json(new ApiError(400, "Duration is required"));
  }

  if (req.user?.watchHistory.includes(videoID)) {
    return res
      .status(200)
      .json(new ApiError(200, "Video already in watch history"));
  }

  const video = await Video.findById(videoID);

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }

  const user = await User.findOneAndUpdate(
    req.user?._id,
    {
      $addToSet: {
        watchHistory: {
          video: videoID,
          duration: duration,
          timestamp: Date.now(),
        },
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while updating watch history"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Video added to watch history"));
});

const deleteVideoFromWatchHistory = asyncHandler(async (req, res, next) => {
  const videoId = req.params.videoId;

  if (!videoId) {
    return res.status(400).json(new ApiError(400, "Video id is required"));
  }

  const user = await User.findOneAndUpdate(
    req.user?._id,
    {
      $pull: {
        watchHistory: {
          video: videoId,
        },
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while deleting video from watch history"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Video deleted from history successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res, next) => {
  const videoId = req.params.videoId;

  if (!videoId) {
    return res.status(400).json(new ApiError(400, "Video id is required"));
  }

  const video = await Video.findOneAndDelete({
    _id: videoId,
    owner: req.user?._id,
  });

  if (!video) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while deleting video"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const getAllVideos = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query; // Retrieve pagination parameters

  const aggregate = Video.aggregate();

  // Apply any additional aggregation stages if needed (e.g., filtering, sorting)
  aggregate.sort({ createdAt: -1 });

  //@ts-ignore
  const paginatedVideos = await Video.aggregatePaginate(aggregate, {
    page,
    limit,
  });

  const totalDocs = paginatedVideos.totalDocs; // Provided by the plugin
  const totalPages = Math.ceil(totalDocs / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos: paginatedVideos.docs,
        totalPages,
      },
      "All videos fetched successfully"
    )
  );
});

const getVideoById = asyncHandler(async (req, res, next) => {
  const videoId = req.params.videoId;

  if (!videoId) {
    return res.status(400).json(new ApiError(400, "Video id is required"));
  }

  const video = await Video.findById(videoId).populate(
    "owner",
    "_id fullname username avatar"
  );

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const tooglePublishStatus = asyncHandler(async (req, res, next) => {
  const videoId = req.params.videoId;

  if (!videoId) {
    return res.status(400).json(new ApiError(400, "Video id is required"));
  }

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { isPublished: !video.isPublished },
    { new: true }
  );

  if (!updatedVideo) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while updating video status"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video status updated"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!videoId) {
    return res.status(400).json(new ApiError(400, "Video id is required"));
  }

  const thumbnail = req.file?.path;

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }

  let thumbnailUrl;

  if (thumbnail) {
    thumbnailUrl = await uploadOnCloudinary(thumbnail);
    if (!thumbnailUrl.url) {
      return res
        .status(500)
        .json(
          new ApiError(500, "Error while uploading thumbnail on cloudinray")
        );
    }
  }

  let updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      title: title || video.title,
      description: description || video.description,
      thumbnail: thumbnailUrl?.url || video.thumbnail,
    },
    { new: true }
  );

  if (!updatedVideo) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while updating video"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

export {
  publishVideo,
  increaseViewCount,
  addVideoToWatchHistory,
  deleteVideoFromWatchHistory,
  deleteVideo,
  getAllVideos,
  getVideoById,
  tooglePublishStatus,
  updateVideo,
};
