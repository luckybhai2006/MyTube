import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/llike.models.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asynchandeler.js";

/**
 * GET /api/v1/dashboard/stats
 * Returns overall stats for the logged-in channel
 */
const getChannelStats = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }
  const channelId = new mongoose.Types.ObjectId(req.user._id);

  // Total videos & total views for this channel
  const [videoAgg] = await Video.aggregate([
    { $match: { owner: channelId } },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  // Total subscribers to this channel
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  // Total likes on all videos owned by this channel
  const likesAgg = await Like.aggregate([
    { $match: { video: { $ne: null } } }, // only video likes
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDoc",
      },
    },
    { $unwind: "$videoDoc" },
    { $match: { "videoDoc.owner": channelId } },
    { $count: "totalLikes" },
  ]);

  const payload = {
    totalVideos: videoAgg?.totalVideos || 0,
    totalViews: videoAgg?.totalViews || 0,
    totalSubscribers,
    totalLikes: likesAgg[0]?.totalLikes || 0,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Channel stats fetched successfully"));
});

/**
 * GET /api/v1/dashboard/videos
 * Returns all videos uploaded by the logged-in channel (with likeCount)
 */
const getChannelVideos = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }
  const channelId = new mongoose.Types.ObjectId(req.user._id);

  const videos = await Video.aggregate([
    { $match: { owner: channelId } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$videoLikes" },
      },
    },
    {
      $project: {
        videoLikes: 0, // drop heavy array
        __v: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
