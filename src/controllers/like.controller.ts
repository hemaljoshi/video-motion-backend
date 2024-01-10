import { Comment } from "../models/comment.model";
import { Like } from "../models/like.model";
import { Tweet } from "../models/tweet.model";
import { Video } from "../models/video.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const toogleCommentLike = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user._id;

  if (!commentId) {
    return res.status(400).json(new ApiError(400, "Comment id is required"));
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(404).json(new ApiError(404, "Comment not found"));
  }

  const isLiked = await Like.findOne({ comment: commentId, likedBy: userId });

  let like
  if (isLiked) {
    like = await Like.findOneAndDelete({
      comment: commentId,
      likedBy: userId,
    });
  } else { 
    like = await Like.create({
      comment: commentId,
      likedBy: userId,
    });
  }

  if (!like) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while liking comment"));
  }

  return res.status(201).json(new ApiResponse(201, like, "Comment liked"));
});

const toogleTweetLike = asyncHandler(async (req, res) => {
  const tweetId = req.params.tweetId;
  const userId = req.user._id;

  if (!tweetId) {
    return res.status(400).json(new ApiError(400, "Tweet id is required"));
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    return res.status(404).json(new ApiError(404, "Tweet not found"));
  }

  const isLiked = await Like.findOne({ tweet: tweetId, likedBy: userId });

  let like
  if (isLiked) {
    like = await Like.findOneAndDelete({ tweet: tweetId, likedBy: userId });
  } else {
    like = await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });
  }

  if (!like) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while liking tweet"));
  }

  return res.status(201).json(new ApiResponse(201, like, "Tweet liked"));
});

const toogleVideoLike = asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;
  const userId = req.user._id;

  if (!videoId) {
    return res.status(400).json(new ApiError(400, "Video id is required"));
  }

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }

  const isLiked = await Like.findOne({ video: videoId, likedBy: userId });

  let like;
  if (isLiked) {
    like = await Like.findOneAndDelete({ video: videoId, likedBy: userId });
  } else {
    like = await Like.create({
      video: videoId,
      likedBy: userId,
    });
  }

  if (!like) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while liking video"));
  }

  return res.status(201).json(new ApiResponse(201, like, "Video liked"));
});

const getVideoLikesCount = asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;

  if (!videoId) {
    return res.status(400).json(new ApiError(400, "Video id is required"));
  }

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }

  const likesCount = await Like.countDocuments({ video: videoId });

  return res
    .status(200)
    .json(new ApiResponse(200, { count: likesCount }, "Video likes count"));
});

const getTweetLikesCount = asyncHandler(async (req, res) => {
  const tweetId = req.params.tweetId;

  if (!tweetId) {
    return res.status(400).json(new ApiError(400, "Tweet id is required"));
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    return res.status(404).json(new ApiError(404, "Tweet not found"));
  }

  const likesCount = await Like.countDocuments({ tweet: tweetId });

  return res
    .status(200)
    .json(new ApiResponse(200, { count: likesCount }, "Tweet likes count"));
});

const getCommentLikesCount = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;

  if (!commentId) {
    return res.status(400).json(new ApiError(400, "Comment id is required"));
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(404).json(new ApiError(404, "Comment not found"));
  }

  const likesCount = await Like.countDocuments({ comment: commentId });

  return res
    .status(200)
    .json(new ApiResponse(200, { count: likesCount }, "Comment likes count"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideos = await Like.find({ likedBy: userId, video: { $ne: null } }) // $ne: null means not equal to null
    .populate("video")
  
  if (!likedVideos) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while getting liked videos"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Liked videos"));
});

export {
  toogleCommentLike,
  toogleTweetLike,
  toogleVideoLike,
  getVideoLikesCount,
  getTweetLikesCount,
  getCommentLikesCount,
  getLikedVideos,
};
