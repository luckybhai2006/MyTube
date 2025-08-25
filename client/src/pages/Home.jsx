import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useVideoContext } from "../context/videoContext"; // custom hook wrapper
import "../styles/VideoCard.css";

const HomePage = () => {
  const { randomVideos, fetchRandomVideos, scrollPos, setScrollPos } =
    useVideoContext();

  useEffect(() => {
    fetchRandomVideos();
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

  if (!randomVideos.length)
    return <p className="text-center mt-10">Loading videos...</p>;

  return (
    <div className="responsiveContainerr">
      {randomVideos.map((video) => (
        <Link
          key={video._id}
          to={`/video/${video._id}`}
          onClick={() => setScrollPos(window.scrollY)} // ✅ save scroll before leaving
          style={{ textDecoration: "none", color: "inherit" }} // ✅ remove underline & keep text color normal
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
                src={video.owner?.avatar || "/default-avatar.png"}
                alt="creator"
                className="creator-avatar"
              />
              <div className="video-info">
                <div className="title-row">
                  <h3 className="video-title">{video.title.length > 40
                  ?`${video.title.substring(0,40)}....`:video.title}</h3>
                  <button className="menu-button">⋮</button>
                </div>
                {/* <p className="video-description">
                  {video.description.length > 60
                    ? `${video.description.substring(0, 60)}...`
                    : video.description}
                </p> */}
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
