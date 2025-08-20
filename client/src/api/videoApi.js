// src/api/videoApi.js
import axiosInstance from "./axiosInstance";

// Get all videos
export const getAllVideos = () => axiosInstance.get("/videos");

// Publish (upload) a video
export const publishVideo = (formData) =>
  axiosInstance.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Get video by ID
export const getVideoById = (videoId) =>
  axiosInstance.get(`/videos/${videoId}`);

// Get all videos uploaded by a specific user
export const getVideosByUser = (userId) =>
  axiosInstance.get(`/videos/user/${userId}`, { withCredentials: true });

// Delete video
export const deleteVideo = (videoId) =>
  axiosInstance.delete(`/videos/${videoId}`);

// Update video (thumbnail or details)
export const updateVideo = (videoId, formData) =>
  axiosInstance.patch(`/videos/${videoId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Toggle publish status
export const togglePublishStatus = (videoId) =>
  axiosInstance.patch(`/videos/toggle/publish/${videoId}`);

// New API to increment views
export const addVideoView = (videoId) =>
  axiosInstance.post(`/videos/views/${videoId}`);

// Like a video
export const likeVideo = (videoId) =>
  axiosInstance.post(`/videos/like/${videoId}`, null, {
    withCredentials: true, // send cookies if needed
  });

// Unlike a video
export const unlikeVideo = (videoId) =>
  axiosInstance.post(`/videos/unlike/${videoId}`, null, {
    withCredentials: true,
  });

export const getRandomVideos = () =>
  axiosInstance.get("/videos/random", null, {
    withCredentials: true,
  });
