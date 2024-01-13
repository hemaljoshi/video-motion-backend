import { Subscription } from "../models/subscription.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  let channel;
  if (existingSubscription) {
    channel = await Subscription.findOneAndDelete({
      channel: channelId,
      subscriber: req.user._id,
    });
  } else {
    channel = await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });
  }

  if (!channel) {
    return res.status(404).json(new ApiError(404, "Channel not found"));
  }

  return res.status(200).json(new ApiResponse(200, channel, "Subscription updated"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subscribers = await Subscription.find({
    channel: channelId,
  })
    .populate("subscriber", "_id fullname username avatar")

  if (subscribers.length === 0) {
    return res.status(404).json(new ApiError(404, "Subscribers not found"));
  }

  return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers found"));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  let { subscriberId } = req.params;

  if (!subscriberId) {
    subscriberId = req.user._id;
  }

  const channels = await Subscription.find({
    subscriber: subscriberId,
  })
    .populate("channel", "_id fullname username avatar")
  
  if (channels.length === 0) {
    return res.status(404).json(new ApiError(404, "Channels not found"));
  }

  return res.status(200).json(new ApiResponse(200, channels, "Channels found"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
