import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RecommendedVideoCard = ({
  _id,
  thumbnail,
  title,
  description,
  owner,
  avatar,
  views,
  duration,
  createdAt,
  onAddToPlaylist,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const formatDuration = (durationInSeconds) => {
    if (!durationInSeconds) return "0:00";

    const totalSeconds = Math.floor(durationInSeconds); // decimal hatao
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

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

  return (
    <div
      style={{
        display: "flex",
        marginBottom: "12px",
        cursor: "pointer",
        width: "100%",
        borderRadius: "15px",
      }}
      onClick={() => navigate(`/video/${_id}`)}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={thumbnail}
          alt="thumbnail"
          style={{ width: "168px", height: "94px", borderRadius: "15px" }}
        />
        <span className="duration-badge">
          {formatDuration(duration || "00:00")}
        </span>
      </div>

      {/* Video Info */}
      <div style={{ marginLeft: "12px", flex: 1, position: "relative" }}>
        <h4
          style={{
            margin: "0 0 4px 0",
            fontSize: "14px",
            fontWeight: "500",
            lineHeight: "1.2",
            display: "-webkit-box",
            WebkitLineClamp: 2, // max 2 lines
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </h4>
        <p
          style={{
            margin: "0 0 4px 0",
            fontSize: "12px",
            color: "#606060",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {owner}
        </p>
        <p
          style={{
            margin: "0",
            fontSize: "12px",
            color: "#606060",
          }}
        >
          {views ? `${views} views` : "0 views"} • {formatTimeAgo(createdAt)}
        </p>

        {/* 3-dot Menu */}
        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <button
            style={{
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            ⋮
          </button>
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "24px",
                right: "0",
                backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                borderRadius: "4px",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  fontSize: "14px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onClick={() => {
                  onAddToPlaylist && onAddToPlaylist(_id);
                  setMenuOpen(false);
                }}
              >
                + Add to Playlist
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendedVideoCard;
