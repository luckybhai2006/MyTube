// api/likeApi.js
import axiosInstance from "./axiosInstance";

// toggle like on video
export const toggleVideoLike = async (videoId) => {
  try {
    const res = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
    return res.data;
  } catch (error) {
    console.error("Error toggling video like:", error);
    throw error;
  }
};

// get all liked videos
export const getLikedVideos = async () => {
  try {
    const res = await axiosInstance.get("/likes/videos");
    return res.data;
  } catch (error) {
    console.error("Error fetching liked videos:", error);
    throw error;
  }
};
