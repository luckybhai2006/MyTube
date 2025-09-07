import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, Link } from "react-router-dom";
import { getLikedVideos } from "../api/likeApi";
import "../styles/watchHistory.css";

const LikedVideosPage = () => {
  const { user } = useContext(UserContext);
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Videos");
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
  }, []);
  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        const response = await getLikedVideos();
        const videos = response.data || response.data?.data || [];
        setLikedVideos(videos);
      } catch (err) {
        setError("Failed to load liked videos");
      } finally {
        setLoading(false);
      }
    };
    fetchLikedVideos();
  }, []);

  // const formatTimeAgo = (dateString) => {
  //   const now = new Date();
  //   const created = new Date(dateString);
  //   const seconds = Math.floor((now - created) / 1000);

  //   const intervals = [
  //     { label: "year", seconds: 31536000 },
  //     { label: "month", seconds: 2592000 },
  //     { label: "week", seconds: 604800 },
  //     { label: "day", seconds: 86400 },
  //     { label: "hour", seconds: 3600 },
  //     { label: "min", seconds: 60 },
  //     { label: "second", seconds: 1 },
  //   ];

  //   for (const interval of intervals) {
  //     const count = Math.floor(seconds / interval.seconds);
  //     if (count >= 1) {
  //       return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  //     }
  //   }
  //   return "just now";
  // };

  const formatViews = (views) => {
    if (!views) return "No views";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  if (!user)
    return (
      <div
        style={{
          marginTop: "120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          color: "#333",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {/* Illustration */}
        <img
          src="https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_fill,q_auto,f_auto/avatar.png
"
          alt="Login Required"
          style={{
            width: "150px",
            height: "150px",
            marginBottom: "25px",
            borderRadius: "50%",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: "transform 0.3s",
          }}
        />

        {/* Text */}
        <p
          style={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "20px",
            textAlign: "center",
            maxWidth: "300px",
          }}
        >
          Login to see your liked videos
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "12px 25px",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "30px",
            border: "none",
            backgroundColor: "#FF0000",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(255,0,0,0.4)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Login
        </button>
      </div>
    );
  return (
    <div
      className="historyContainer"
      style={{
        marginTop: "90px",
        minHeight: "100%",
        color: "#fff",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Playlist Info Card */}

      {/* Videos Column */}
      <main style={styles.content}>
        {loading && <p>Loading liked videos...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && likedVideos.length === 0 && (
          <p>No liked videos yet.</p>
        )}
        <div style={styles.historyList}>
          {!loading &&
            !error &&
            likedVideos.length > 0 &&
            likedVideos.map((video, index) => (
              <div
                key={video._id || video.video?._id || index}
                style={styles.videoItem}
                onClick={() =>
                  navigate(`/video/${video.video._id || video.video?._id}`)
                }
              >
                <Link
                  to={`/video/${video.video._id || video.video?._id}`}
                  style={styles.thumbnailLink}
                >
                  <div style={styles.thumbnailContainer}>
                    <img
                      src={
                        video.thumbnail ||
                        video.video?.thumbnail ||
                        "https://via.placeholder.com/168x94"
                      }
                      alt={video.video?.title || "Untitled Video"}
                      style={styles.thumbnail}
                    />
                    <div style={styles.videoDuration}>
                      {Math.floor(video.video.duration / 60)}:
                      {Math.floor(video.video.duration % 60)
                        .toString()
                        .padStart(2, "0")}
                    </div>
                  </div>
                </Link>

                <div style={styles.videoInfo}>
                  <Link
                    to={`/video/${video.video._id || video.video?._id}`}
                    style={styles.videoTitleLink}
                  >
                    <h3 style={styles.videoTitle}>
                      {video.video?.title || "Untitled Video"}
                    </h3>
                  </Link>

                  <div style={styles.videoMetadata}>
                    <span style={styles.channelName}>
                      {video.video.owner?.username || "Unknown Channel"}
                    </span>
                    <span style={styles.metadataSeparator}>•</span>
                    <span style={styles.views}>
                      {formatViews(video.video?.views)}
                    </span>
                    {/* <span style={styles.metadataSeparator}>•</span>
                  <span style={styles.timestamp}>
                    {formatTimeAgo(video.video?.createdAt || "1 year ago")}
                  </span> */}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  content: {
    flex: 1,
    padding: "24px",
  },
  videoItem: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
    cursor: "pointer",
  },
  thumbnailLink: {
    textDecoration: "none",
  },
  thumbnailContainer: {
    position: "relative",
    width: "200px",
    height: "120px",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "12px",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    // gap: "16px",
    marginBottom: "40px",
    width: "104%",
  },
  videoDuration: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    padding: "2px 4px",
    borderRadius: "2px",
    fontSize: "12px",
    fontWeight: "500",
  },
  videoInfo: {
    flex: 1,
  },
  videoTitleLink: {
    textDecoration: "none",
  },
  videoTitle: {
    margin: "0 0 4px 0",
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "1.2",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#0f0f0f",
  },
  videoMetadata: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
    color: "#aaa",
    marginTop: "8px",
  },
  metadataSeparator: {
    margin: "0 4px",
    fontSize: "18px",
  },
  channelName: {
    color: "#555",
    fontSize: "14px",
  },
  views: {
    color: "#777",
    fontSize: "12px",
  },
  timestamp: {
    color: "#999",
    fontSize: "12px",
  },
};

export default LikedVideosPage;
