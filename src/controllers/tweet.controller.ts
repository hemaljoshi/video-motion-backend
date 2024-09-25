import { Tweet } from "../models/tweet.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const createTweet = asyncHandler(async (req : any, res: any) => {
  const { content } = req.body;
  const { _id } = req.user;

  if (!content) {
    return res.status(400).json(new ApiError(400, "Tweet content is required"));
  }

  const tweet = await Tweet.create({ content, owner: _id });

  if (!tweet) {
    return res.status(500).json(new ApiError(500, "Something went wrong while creating tweet"));
  }

  return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getAllTweet = asyncHandler(async (req : any, res: any) => {
  const tweets = await Tweet.find().populate(
    "owner",
    "_id fullname username avatar"
  );

  if (!tweets) {
    return res.status(404).json(new ApiError(404, "No tweet found"));
  }

  return res.status(200).json(new ApiResponse(200, tweets, "All tweets fetched successfully"));
});

const getUserTweet = asyncHandler(async (req : any, res: any) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json(new ApiError(400, "User id is required"));
  }

  const tweets = await Tweet.find({ owner: userId }).populate(
    "owner",
    "_id fullname username avatar"
  );

  if (!tweets) {
    return res.status(404).json(new ApiError(404, "Tweet not found"));
  }

  return res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req : any, res: any) => {
  const { content } = req.body;
  const { tweetId } = req.params;

  if (!tweetId) {
    return res.status(400).json(new ApiError(400, "Tweet id is required"));
  }

  if (!content) {
    return res.status(400).json(new ApiError(400, "Content is required"));
  }

  const tweet = await Tweet.findOneAndUpdate(
    { _id: tweetId },
    { content },
    { new: true }
  );

  if (!tweet) {
    return res.status(404).json(new ApiError(404, "Tweet not found"));
  }

  return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req : any, res: any) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    return res.status(400).json(new ApiError(400, "Tweet id is required"));
  }

  const tweet = await Tweet.findByIdAndDelete(tweetId);

  if (!tweet) {
    return res.status(404).json(new ApiError(404, "Tweet not found"));
  }

  return res.status(200).json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getAllTweet, updateTweet, deleteTweet, getUserTweet };
