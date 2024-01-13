import mongoose from "mongoose";
import { Video } from "../models/video.model";
import { Subscription } from "../models/subscription.model";
import { Like } from "../models/like.model";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const channelId = req.params.channelId;

  if (!channelId)
    return res.status(400).json(new ApiError(400, "Channel ID is required"));

  const channel = await Subscription.findOne({ channel: channelId });

  if (!channel)
    return res.status(404).json(new ApiError(404, "Channel not found"));

  let video = await Video.find({ owner: channelId }).select("_id");

  const totalVideos = video.length;

  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  const totalLikes = await Like.countDocuments({
    video: { $in: video },
  });

  const totalViews = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $group: {
        _id: null,
        views: { $sum: "$views" },
      },
    },
  ]);

  const totalComments = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $group: {
        _id: null,
        comments: { $sum: "$comments" },
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      totalVideos,
      totalSubscribers,
      totalLikes,
      totalViews: totalViews[0].views,
      totalComments: totalComments[0].comments,
    })
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  const channelId = req.params.channelId;

  if (!channelId)
    return res.status(400).json(new ApiError(400, "Channel ID is required"));

  const channelVideos = await Video.find({ owner: channelId });

  if (!channelVideos)
    return res.status(404).json(new ApiError(404, "Channel not found"));

  res.status(200).json(new ApiResponse(200, channelVideos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
