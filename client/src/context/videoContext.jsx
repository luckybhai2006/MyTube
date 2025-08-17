// src/context/VideoContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { getVideosByUser } from "../api/videoApi"; // We'll add this in videoApi.js
import { UserContext } from "./userContext";

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Auto-fetch when user changes (like login/logout)
  useEffect(() => {
    fetchOwnerVideos();
  }, [user]);

  return (
    <VideoContext.Provider value={{ videos, loading, fetchOwnerVideos }}>
      {children}
    </VideoContext.Provider>
  );
};
