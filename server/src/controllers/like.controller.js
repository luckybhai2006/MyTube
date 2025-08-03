import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/llike.models.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apierror.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asynchandeler.js";

// Toggle like for video
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // ✅ Check if the video exists
  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Video unliked successfully")
      );
  }

  const like = await Like.create({ video: videoId, likedBy: userId });

  return res
    .status(201)
    .json(new ApiResponse(201, { liked: true }, "Video liked successfully"));
});

// Toggle like for comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  // ✅ Check if the video exists
  const commentExists = await Comment.findById(commentId);
  if (!commentExists) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });

  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Comment unliked successfully")
      );
  }

  const like = await Like.create({ comment: commentId, likedBy: userId });

  return res
    .status(201)
    .json(new ApiResponse(201, { liked: true }, "Comment liked successfully"));
});

// Toggle like for tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });

  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Tweet unliked successfully")
      );
  }

  const like = await Like.create({ tweet: tweetId, likedBy: userId });

  return res
    .status(201)
    .json(new ApiResponse(201, { liked: true }, "Tweet liked successfully"));
});

// Get all liked videos by user
const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideos = await Like.find({
    likedBy: userId,
    video: { $ne: null },
  })
    .populate("video")
    .select("-comment -tweet");

  // ✅ Filter out deleted videos
  const validLikedVideos = likedVideos.filter((like) => like.video !== null);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        validLikedVideos,
        "Liked videos fetched successfully"
      )
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
