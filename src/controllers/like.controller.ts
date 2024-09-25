import { Comment } from "../models/comment.model";
import { Like } from "../models/like.model";
import { Tweet } from "../models/tweet.model";
import { Video } from "../models/video.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const toggleCommentLike = asyncHandler(async (req : any, res: any) => {
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

  let like;
  let message;
  if (isLiked) {
    like = await Like.findOneAndDelete({
      comment: commentId,
      likedBy: userId,
    });
    message = "Successfully unliked the comment.";
  } else {
    like = await Like.create({
      comment: commentId,
      likedBy: userId,
    });
    message = "Successfully liked the comment.";
  }

  if (!like) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while liking comment"));
  }

  return res.status(201).json(new ApiResponse(201, like, message));
});

const toggleTweetLike = asyncHandler(async (req : any, res: any) => {
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

  let like;
  let message;
  if (isLiked) {
    like = await Like.findOneAndDelete({ tweet: tweetId, likedBy: userId });
    message = "Successfully unliked the tweet.";
  } else {
    like = await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });
    message = "Successfully liked the tweet.";
  }

  if (!like) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while liking tweet"));
  }

  return res.status(201).json(new ApiResponse(201, like, message));
});

const toggleVideoLike = asyncHandler(async (req : any, res: any) => {
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
  let message;
  if (isLiked) {
    like = await Like.findOneAndDelete({ video: videoId, likedBy: userId });
    message = "Successfully unliked the video.";
  } else {
    like = await Like.create({
      video: videoId,
      likedBy: userId,
    });
    message = "Successfully liked the video.";
  }

  if (!like) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while liking video"));
  }

  return res
    .status(201)
    .json(new ApiResponse(201, like, message));
});

const getVideoLikesCount = asyncHandler(async (req : any, res: any) => {
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
    .json(
      new ApiResponse(
        200,
        { count: likesCount },
        "Successfully retrieved video likes count."
      )
    );
});

const getTweetLikesCount = asyncHandler(async (req : any, res: any) => {
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
    .json(
      new ApiResponse(
        200,
        { count: likesCount },
        "Successfully retrieved tweet likes count."
      )
    );
});

const getCommentLikesCount = asyncHandler(async (req : any, res: any) => {
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
    .json(
      new ApiResponse(
        200,
        { count: likesCount },
        "Successfully retrieved comment likes count."
      )
    );
});

const getLikedVideos = asyncHandler(async (req : any, res: any) => {
  const userId = req.user._id;

  const likedVideos = await Like.find({ likedBy: userId, video: { $ne: null } }) // $ne: null means not equal to null
    .populate("video");

  if (!likedVideos) {
    return res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong while retrieving liked videos")
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Successfully retrieved liked videos.")
    );
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getVideoLikesCount,
  getTweetLikesCount,
  getCommentLikesCount,
  getLikedVideos,
};
