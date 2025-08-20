import React, { useEffect, useState } from "react";
import {
  getWatchHistory,
  removeFromWatchHistory,
  clearWatchHistory,
  togglePauseWatchHistory,
} from "../api/userApi";
import { Link } from "react-router-dom";

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false); // UI state for pause

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getWatchHistory();
      const videos = res?.data?.data || [];
      setHistory(videos);

      if (res?.data?.paused?.paused !== undefined) {
        setIsPaused(res.data.paused.paused); // update from backend nested paused object
      }
    } catch (err) {
      console.error("Error fetching watch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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
      setHistory([]); // Clear frontend history
    } catch (err) {
      console.error("Error clearing watch history:", err);
    }
  };

  const handleTogglePause = async () => {
    try {
      const res = await togglePauseWatchHistory(); // call backend to toggle
      setIsPaused(res.data.paused); // update pause state from backend response
      // Do NOT clear or modify history here, keep videos visible at all times
    } catch (err) {
      console.error("Error toggling pause state:", err);
    }
  };

  return (
    <div style={styles.container}>
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
                    <div style={styles.videoDuration}>{video.duration}</div>
                  </div>
                </Link>

                <div style={styles.videoInfo}>
                  <Link
                    to={`/video/${video._id}`}
                    style={styles.videoTitleLink}
                  >
                    <h3 style={styles.videoTitle}>{video.title}</h3>
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
    //  marginLeft: "70px",
    //  backgroundColor: "#0f0f0f",
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
  videoTitle: {
    fontSize: "16px",
    //  color: "#0f0f0f",
    fontWeight: "500",
    margin: "0 0 8px 0",
    color: "#0f0f0f",
    lineHeight: "1.4",
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
  },
  channelName: {
    color: "#aaa",
  },
  views: {
    color: "#aaa",
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
    "&:hover": {
      color: "#fff",
    },
  },
};
export default WatchHistory;
