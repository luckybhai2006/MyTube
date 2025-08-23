import React, { useEffect, useState, useContext } from "react";
import VideoCard from "../components/VideoCard";
import { UserContext } from "../context/userContext";
import axiosInstance from "../api/axiosInstance";

const Dashboard = () => {
  const { user, activeCategory } = useContext(UserContext);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // 🟡 Fetch videos
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

  // 🟡 Fetch subscriber count
  useEffect(() => {
    const fetchSubscriberCount = async () => {
      try {
        const res = await axiosInstance.get(`/subscriptions/u/${user._id}`, {
          withCredentials: true,
        });
        setSubscriberCount(res.data.data.length);
      } catch (err) {
        console.error("Failed to fetch subscriber count:", err);
      }
    };

    if (user?._id) {
      fetchSubscriberCount();
    }
  }, [user]);

  // 🟡 Filter by category
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
    <>
      {/* 👤 Top Section: Avatar, Name, Subscriber Count */}
      <div className="responsiveContainerr">
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "10px 0",
              borderBottom: "1px solid #ccc",
            }}
          >
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={user.username}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <div>
              <h2 style={{ margin: 0 }}>{user.username}</h2>
              <p style={{ margin: 0, color: "#666" }}>
                {subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""} ·{" "}
                {videos.length} video{videos.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 🎥 Video list */}
      <div className="responsiveContainer">
        {filteredVideos.map((video) => (
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
        ))}
      </div>
    </>
  );
};

export default Dashboard;
