import React, { useEffect, useState, useContext } from "react";
import VideoCard from "../components/VideoCard";
import { UserContext } from "../context/userContext";
import axiosInstance from "../api/axiosInstance";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get(`/videos/user/${user._id}`, {
          withCredentials: true,
        });
        setVideos(res.data);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    };

    if (user?._id) {
      fetchVideos();
    }
  }, [user]);

  return (
    <div className="responsiveContainer">
      {videos.length > 0 ? (
        videos.map((video) => (
          <VideoCard
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
        <p style={{ color: "#fff" }}>No videos uploaded yet.</p>
      )}
    </div>
  );
};

export default Dashboard;
