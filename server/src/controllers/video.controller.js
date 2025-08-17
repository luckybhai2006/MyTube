import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
// import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asynchandeler.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  // Extract query parameters with defaults
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  // Build filter object
  const filter = {};

  if (query.trim()) {
    filter.title = { $regex: query.trim(), $options: "i" }; // case-insensitive
  }

  if (userId && isValidObjectId(userId)) {
    filter.owner = userId;
  }

  // Build sort options
  const sortOptions = {
    [sortBy]: sortType === "asc" ? 1 : -1,
  };

  // Query videos
  const videos = await Video.find(filter)
    .sort(sortOptions)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate("owner", "username avatar");

  // Count total documents for pagination
  const total = await Video.countDocuments(filter);

  // Send response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
      "Videos fetched successfully"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;

  // console.log("📦 Incoming files:", req.files); // ✅ Debug incoming file uploads

  const videoFile = req.files?.videoFile;
  const thumbnailFile = req.files?.thumbnail;

  if (!videoFile || !thumbnailFile) {
    throw new ApiError(400, "Video and thumbnail are required.");
  }
  // ...........................................................
  // console.log("Uploading video to Cloudinary:", videoFile[0].path);
  const videoUpload = await uploadOnCloudinary(videoFile[0].path);
  // console.log("Video uploaded result:", videoUpload);

  // console.log("Uploading thumbnail to Cloudinary:", thumbnailFile[0].path);
  const thumbnailUpload = await uploadOnCloudinary(thumbnailFile[0].path);
  // console.log("Thumbnail uploaded result:", thumbnailUpload);
  // ...........................................................

  if (!videoUpload?.url || !thumbnailUpload?.url) {
    throw new ApiError(500, "Upload to Cloudinary failed.");
  }

  const video = await Video.create({
    title,
    description,
    duration: videoUpload?.duration,
    videoFile: videoUpload.url,
    thumbnail: thumbnailUpload.url,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  const video = await Video.findById(videoId).populate(
    "owner",
    "username avatar"
  );

  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully."));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can't update this video.");
  }

  if (title) video.title = title;
  if (description) video.description = description;

  if (req.file) {
    const thumbnailUpload = await uploadOnCloudinary(req.file.path);
    video.thumbnail = thumbnailUpload.url;
  }

  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can't delete this video.");
  }

  await video.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to toggle this video.");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video publish status toggled."));
});

// Get all videos uploaded by a specific user
const getVideosByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const videos = await Video.find({ owner: userId })
      .populate("owner", "username avatar") // optional: include owner info
      .sort({ createdAt: -1 }); // latest first

    if (!videos.length) {
      return res.status(404).json({ message: "No videos found for this user" });
    }

    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos by user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getVideosByUser,
};
