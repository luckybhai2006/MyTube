
import React, { useEffect, useState, useContext } from "react";
import VideoCard from "../components/VideoCard";
import { UserContext } from "../context/userContext";
import axiosInstance from "../api/axiosInstance";

const Dashboard = () => {
  const { user, activeCategory } = useContext(UserContext);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get(`/videos/user/${user._id}`, {
          withCredentials: true,
        });
        setVideos(res.data);
        setFilteredVideos(res.data);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    };

    if (user?._id) {
      fetchVideos();
    }
  }, [user]);

  // ✅ Apply global category filter whenever activeCategory changes
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(
        videos.filter((video) => video.category === activeCategory)
      );
    }
  }, [activeCategory, videos]);

  return (
    <div className="responsiveContainer">
      {filteredVideos.length > 0 ? (
        filteredVideos.map((video) => (
          <VideoCard
            key={video._id}
            createdAt={video.createdAt}
            _id={video._id}
            thumbnail={video.thumbnail}
            duration={video.duration}
            title={video.title}
            description={video.description}
            owner={video.owner.username}
            avatar={video.owner.avatar}
            views={video.views}
          />
        ))
      ) : (
        <p>No videos found in {activeCategory}.</p>
      )}
    </div>
  );
};

export default Dashboard;
