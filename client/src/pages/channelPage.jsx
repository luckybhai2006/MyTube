import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const ChannelPage = () => {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        // Get user details by username
        const userRes = await axios.get(
          `${API_URL}/api/v1/users/C/${username}`,
          { withCredentials: true }
        );
        const user = userRes.data.data;
        setUserInfo(user);

        // Get videos by user._id
        const videoRes = await axios.get(
          `${API_URL}/api/v1/videos/user/${user._id}`,
          { withCredentials: true }
        );
        setVideos(videoRes.data || []);

        // Get subscriber count
        const res = await axios.get(
          `${API_URL}/api/v1/subscriptions/u/${user._id}`,
          { withCredentials: true }
        );
        setSubscriberCount(res.data.data.length);
      } catch (err) {
        console.error("Failed to load channel", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelDetails();
  }, [username]);

  // if (loading) return <p style={styles.loading}>Loading channel...</p>;
  // if (!userInfo) return <p style={styles.loading}>Channel not found</p>;

  return (
    <>
      {userInfo && (
        <div
          className="coverImage"
          style={{
            width: "100%",
            height: "200px",
            position: "relative",
            maxWidth: "1400px",
            marginTop: "70px",
            marginBottom: "-130px",
            left: "0",
            overflow: "hidden",
          }}
        >
          <img
            style={{
              width: "100%",
              height: "100%",
              top: "50px",
              position: "absolute",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
            src={userInfo.coverImage}
            alt="coverImage"
          />
        </div>
      )}
      {/* 👤 Top Section: Avatar, Name, Subscriber Count */}
      <div className="responsiveContainerr">
        {userInfo && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              // marginTop: "7%",
              padding: "10px 0",
              borderBottom: "1px solid #ccc",
            }}
          >
            <img
              src={userInfo.avatar || "/default-avatar.png"}
              alt={userInfo.username}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <div>
              <h2 style={{ margin: 0 }}>{userInfo.username}</h2>
              <p style={{ margin: 0, color: "#666" }}>
                {subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""} .{" "}
                {videos.length} videos
              </p>
            </div>
          </div>
        )}
      </div>
      {/* 🎥 Your existing video list — untouched */}
      <div className="responsiveContainer">
        {videos.map((video) => (
          <Link
            key={video._id}
            to={`/video/${video._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="video-card">
              <div className="video-thumbnail">
                <img
                  src={video.thumbnail || "/default-thumbnail.jpg"}
                  alt={video.title}
                />
                <span className="duration-badge">
                  {video.duration || "00:00"}
                </span>
              </div>

              <div className="video-body">
                <img
                  src={
                    video.owner?.avatar ||
                    userInfo?.avatar ||
                    "/default-avatar.png"
                  }
                  alt="creator"
                  className="creator-avatar"
                />
                <div className="video-info">
                  <div className="title-row">
                    <h3 className="video-title">{video.title}</h3>
                    <button className="menu-button">⋮</button>
                  </div>
                  <p className="video-owner">
                    {video.owner?.username || userInfo?.username || "Unknown"}
                  </p>
                  <p className="video-meta">
                    {video.views ? `${video.views} views` : "0 views"} •{" "}
                    {new Date(video.createdAt).toDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default ChannelPage;
