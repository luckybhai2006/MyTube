import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asynchandeler.js";

// Toggle subscription (subscribe/unsubscribe)
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id; // user who is performing the action

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (channelId.toString() === subscriberId.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  // ✅ ADD THIS LINE: Check if the user with channelId exists
  const channelUser = await User.findById(channelId);
  if (!channelUser) {
    throw new ApiError(404, "Channel user does not exist");
  }

  const existingSub = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });

  if (existingSub) {
    // Already subscribed -> Unsubscribe
    await existingSub.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unsubscribed from channel"));
  } else {
    // Subscribe
    await Subscription.create({
      channel: channelId,
      subscriber: subscriberId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, null, "Subscribed to channel"));
  }
});

// Get list of subscribers for a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
    throw new ApiError(400, "Invalid channel ID you provided");
  }

  // Check if the channel (user) exists
  const subscriberExists = await User.findById(subscriberId);
  if (!subscriberExists) {
    throw new ApiError(404, "Channel (user) not found");
  }

  const subscribers = await Subscription.find({ channel: subscriberId })
    .populate("subscriber", "username avatar email") // returns only necessary fields
    .exec();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        "List of subscribers fetched successfully"
      )
    );
});

// Get channels the user has subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscribeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(subscribeId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const subscriptions = await Subscription.find({ subscriber: subscribeId })
    .populate("channel", "username avatar email") // send channel info
    .exec();

  if (subscriptions.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No subscribed channels found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscriptions, "List of subscribed channels fetched")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
