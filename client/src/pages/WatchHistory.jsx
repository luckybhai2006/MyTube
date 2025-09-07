import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, Link } from "react-router-dom";
import {
  getWatchHistory,
  removeFromWatchHistory,
  clearWatchHistory,
  togglePauseWatchHistory,
} from "../api/userApi";
import "../styles/watchHistory.css";

const WatchHistory = () => {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const navigate = useNavigate();

  // Fetch history only if user is logged in
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await getWatchHistory();
        const videos = res?.data?.data || [];
        setHistory(videos);

        if (res?.data?.paused?.paused !== undefined) {
          setIsPaused(res.data.paused.paused);
        }
      } catch (err) {
        console.error("Error fetching watch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleRemove = async (videoId) => {
    try {
      await removeFromWatchHistory(videoId);
      setHistory((prev) => prev.filter((video) => video._id !== videoId));
    } catch (err) {
      console.error("Error removing video:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearWatchHistory();
      setHistory([]);
    } catch (err) {
      console.error("Error clearing watch history:", err);
    }
  };

  const handleTogglePause = async () => {
    try {
      const res = await togglePauseWatchHistory();
      setIsPaused(res.data.paused);
    } catch (err) {
      console.error("Error toggling pause state:", err);
    }
  };

  // ============================
  // Conditional Rendering Section
  // ============================

  if (!user) {
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
        <img
          src="https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_fill,q_auto,f_auto/avatar.png"
          alt="Login Required"
          style={{
            width: "150px",
            height: "150px",
            marginBottom: "25px",
            borderRadius: "50%",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        />
        <p
          style={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "20px",
            textAlign: "center",
            maxWidth: "300px",
          }}
        >
          Login to see your watch history
        </p>
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
  }

  if (loading) {
    return (
      <p style={{ marginTop: "100px", textAlign: "center" }}>Loading...</p>
    );
  }

  return (
    <div style={styles.container} className="historyContainer">
      <div style={styles.mainLayout}>
        <div style={styles.content}>
          <div style={styles.historyHeader}>
            <h2 style={styles.historyTitle}>Watch history</h2>
            <div style={styles.historyActions}>
              <button style={styles.manageButton} onClick={handleTogglePause}>
                {isPaused ? "Resume watch history" : "Pause watch history"}
              </button>
              <button style={styles.clearButton} onClick={handleClearAll}>
                Clear all watch history
              </button>
            </div>
          </div>

          <div style={styles.historyList}>
            {history.length === 0 && (
              <p>
                {isPaused
                  ? "Watch history is paused."
                  : "No watch history found."}
              </p>
            )}

            {history.map((video) => (
              <div key={video._id} style={styles.videoItem}>
                <Link to={`/video/${video._id}`} style={styles.thumbnailLink}>
                  <div style={styles.thumbnailContainer}>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      style={styles.thumbnail}
                    />
                    <div style={styles.videoDuration}>
                      {Math.floor(video.duration / 60)}:
                      {Math.floor(video.duration % 60)
                        .toString()
                        .padStart(2, "0")}
                    </div>
                  </div>
                </Link>

                <div style={styles.videoInfo}>
                  <Link
                    to={`/video/${video._id}`}
                    style={styles.videoTitleLink}
                  >
                    <h3
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "16px",
                        fontWeight: "500",
                        lineHeight: "1.2",
                        display: "-webkit-box",
                        WebkitLineClamp: 2, // max 2 lines
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#0f0f0f",
                      }}
                    >
                      {video.title}
                    </h3>
                  </Link>

                  <div style={styles.videoMetadata}>
                    <span style={styles.channelName}>
                      {video.owner.username}
                    </span>
                    <span style={styles.metadataSeparator}>•</span>
                    <span style={styles.views}>{video.views} views</span>
                  </div>

                  <div style={styles.videoActions}>
                    <button
                      style={styles.removeButton}
                      onClick={() => handleRemove(video._id)}
                      title="Remove from watch history"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    // marginLeft: "60px",
    marginTop: "50px",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "'Roboto', sans-serif",
  },

  content: {
    flex: 1,
    padding: "24px",
  },
  historyHeader: {
    backgroundColor: "#lelelele", // Prevents content behind from showing
    padding: "16px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyTitle: {
    fontSize: "20px",
    color: "#0f0f0f",
    fontWeight: "500",
    margin: 0,
  },
  historyActions: {
    display: "flex",
    gap: "12px",
  },
  manageButton: {
    backgroundColor: "transparent",
    border: "1px solid #3ea6ff",
    color: "#3ea6ff",
    padding: "8px 16px",
    borderRadius: "18px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  clearButton: {
    backgroundColor: "transparent",
    border: "1px solid #303030",
    color: "#0f0f0f",
    padding: "8px 16px",
    borderRadius: "18px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "40px",
    width: "104%",
  },
  videoItem: {
    display: "flex",
    gap: "16px",
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
  videoMetadata: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
    color: "#aaa",
    marginBottom: "12px",
  },
  metadataSeparator: {
    margin: "0 4px",
    fontSize: "18px",
  },
  channelName: {
    color: "#aaa",
    fontSize: "14px",
  },
  views: {
    color: "#aaa",
    fontSize: "12px",
  },
  timestamp: {
    color: "#aaa",
  },
  videoActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  channelIcon: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    marginRight: "8px",
  },
  actionButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#aaa",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "18px",
    "&:hover": {
      backgroundColor: "#272727",
    },
  },
  removeButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#aaa",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    padding: "4px 8px",
    marginLeft: "auto",
    color: "#FF0000",
  },
};
export default WatchHistory;
