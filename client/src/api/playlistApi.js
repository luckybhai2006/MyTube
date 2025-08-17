// src/api/playlistApi.js
import axiosInstance from "./axiosInstance";

// Create playlist
export const createPlaylist = (data) => axiosInstance.post("/playlists", data);

// Get playlist by ID
export const getPlaylistById = (playlistId) =>
  axiosInstance.get(`/playlists/${playlistId}`);

// Update playlist
export const updatePlaylist = (playlistId, data) =>
  axiosInstance.patch(`/playlists/${playlistId}`, data);

// Delete playlist
export const deletePlaylist = (playlistId) =>
  axiosInstance.delete(`/playlists/${playlistId}`);

// Add video to playlist
export const addVideoToPlaylist = (videoId, playlistId) =>
  axiosInstance.patch(`/playlists/add/${videoId}/${playlistId}`);

// Remove video from playlist
export const removeVideoFromPlaylist = (videoId, playlistId) =>
  axiosInstance.patch(`/playlists/remove/${videoId}/${playlistId}`);

// Get all playlists of a user
export const getUserPlaylists = (userId) =>
  axiosInstance.get(`/playlists/user/${userId}`);
