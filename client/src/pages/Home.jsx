import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useVideoContext } from "../context/videoContext";
import "../styles/VideoCard.css";

const HomePage = () => {
  const { randomVideos, fetchRandomVideos, scrollPos, setScrollPos } =
    useVideoContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // 2 sec mandatory loader
    const timer = setTimeout(() => {
      fetchRandomVideos().finally(() => setLoading(false));
    }, 2000);

    return () => clearTimeout(timer);
  }, [fetchRandomVideos]);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const seconds = Math.floor((now - created) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "min", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };
  // Skeleton Loader (YouTube style)
  if (loading) {
    return (
      <div className="responsiveContainerr">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="video-card skeleton">
              <div className="video-thumbnail"></div>
              <div className="video-body">
                <div className="skeleton-circle"></div>
                <div className="video-info">
                  <div className="skeleton-box title"></div>
                  <div className="skeleton-box subtitle"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  // Real Videos
  return (
    <div className="responsiveContainerr">
      {randomVideos.map((video) => (
        <Link
          key={video._id}
          to={`/video/${video._id}`}
          onClick={() => setScrollPos(window.scrollY)}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="video-card">
            <div className="video-thumbnail">
              <img
                src={video.thumbnail || "/default-thumbnail.jpg"}
                alt={video.title}
              />
              <span className="duration-badge">
                {Math.floor(video.duration / 60)}:
                {Math.floor(video.duration % 60)
                  .toString()
                  .padStart(2, "0")}
              </span>
            </div>
            <div className="video-body">
              <img
                src={video.owner?.avatar || "/default-avatar.png"}
                alt="creator"
                className="creator-avatar"
              />
              <div className="video-info">
                <div className="title-row">
                  <h3 className="video-title">{video.title}</h3>
                  <button className="menu-button">⋮</button>
                </div>
                <p className="video-owner">
                  {video.owner?.username || "Unknown"}
                </p>
                <p className="video-meta">
                  {video.views ? `${video.views} views` : "0 views"} •{" "}
                  {formatTimeAgo(video.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HomePage;
