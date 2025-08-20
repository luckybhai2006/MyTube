// src/context/VideoContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { getVideosByUser, getRandomVideos } from "../api/videoApi";
import { UserContext } from "./userContext";

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [videos, setVideos] = useState([]); // user videos
  const [randomVideos, setRandomVideos] = useState([]); // home page videos
  const [scrollPos, setScrollPos] = useState(0); // ✅ scroll position
  const [loading, setLoading] = useState(false);

  // Fetch user videos
  const fetchOwnerVideos = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await getVideosByUser(user._id);
      setVideos(res.data || []);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch random videos (homepage)
  const fetchRandomVideos = async () => {
    if (randomVideos.length > 0) return; // ✅ don’t refetch if already loaded
    try {
      const res = await getRandomVideos();
      setRandomVideos(res.data || []);
    } catch (err) {
      console.error("Failed to fetch random videos:", err);
    }
  };

  // Restore scroll after navigating back
  useEffect(() => {
    if (scrollPos > 0) {
      window.scrollTo(0, scrollPos);
    }
  }, [scrollPos]);

  return (
    <VideoContext.Provider
      value={{
        videos,
        randomVideos,
        setRandomVideos,
        loading,
        fetchOwnerVideos,
        fetchRandomVideos,
        scrollPos,
        setScrollPos, // ✅ expose setter
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
export const useVideoContext = () => {
  return useContext(VideoContext);
};
