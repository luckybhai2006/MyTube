import React, { useState } from "react";
import { updateVideo, deleteVideo } from "../api/videoApi";
import { useNavigate } from "react-router-dom";
import "../styles/VideoCard.css";

const VideoCard = ({
  _id,
  thumbnail,
  title,
  description,
  owner,
  avatar,
  views,
  duration,
  createdAt,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newThumbnail, setNewThumbnail] = useState(null);
  const navigate = useNavigate();

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("description", newDescription);
      if (newThumbnail) formData.append("thumbnail", newThumbnail);

      await updateVideo(_id, formData);
      alert("Updated successfully!");
      setShowUpdateModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await deleteVideo(_id);
      alert("Video deleted successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Delete failed", err);
    }
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
    <div className="video-card">
      <div className="video-thumbnail" onClick={() => navigate(`/video/${_id}`)}>
        <img src={thumbnail} alt="thumbnail" />
        <span className="duration-badge">{duration}</span>
      </div>

      <div className="video-body">
        <img className="creator-avatar" src={avatar} alt="avatar" />

        <div className="video-info">
          <div className="title-row">
            <h3 className="video-title">{title}</h3>
            <button
              className="menu-button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              ⋮
            </button>
            {menuOpen && (
              <div className="menu-popup">
                <div
                  className="menu-item"
                  onClick={() => {
                    setShowUpdateModal(true);
                    setMenuOpen(false);
                  }}
                >
                  Update
                </div>
                <div className="menu-item" onClick={handleDelete}>
                  Delete
                </div>
              </div>
            )}
          </div>

          <p className="video-description">
            {description.length > 60
              ? `${description.substring(0, 60)}...`
              : description}
          </p>
          <p className="video-owner">{owner}</p>
          <p className="video-meta">
            {views ? `${views} views` : "0 views"} • {formatTimeAgo(createdAt)}
          </p>
        </div>
      </div>

      {showUpdateModal && (
        <div className="modal-backdrop" onClick={() => setShowUpdateModal(false)}>
          <div className="update-modal" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description"
            />
            <input
              type="file"
              onChange={(e) => setNewThumbnail(e.target.files[0])}
            />
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={handleUpdateSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;