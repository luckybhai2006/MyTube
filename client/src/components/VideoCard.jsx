import React, { useState } from "react";
import { updateVideo, deleteVideo } from "../api/videoApi";
import { useNavigate } from "react-router-dom";
const styles = {
  card: {
    borderRadius: "10px",
    width: "300px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    background: "#fff",
    cursor: "pointer",
    position: "relative",
  },
  owner: {
    fontSize: "0.88rem",
    fontWeight: "500",
    color: "#0f0f0f", // dark like YouTube
    margin: "0 0 4px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  thumbnailWrapper: { position: "relative" },
  thumbnail: {
    width: "100%",
    height: "170px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  durationBadge: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    fontSize: "12px",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  content: { padding: "10px" },

  // Layout
  row: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  rightColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  // Title row
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  title: {
    flex: 1,
    fontSize: "1.05rem",
    fontWeight: "bold",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  menuButton: {
    background: "transparent",
    border: "none",
    fontSize: "1.3rem",
    color: "#666",
    cursor: "pointer",
    padding: "2px 6px",
    borderRadius: "50%",
    transition: "background 0.2s",
  },
  menuButtonHover: {
    background: "rgba(0,0,0,0.1)",
  },
  menuPopup: {
    position: "absolute",
    top: "40px",
    right: "10px",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    borderRadius: "6px",
    zIndex: 20,
  },
  popupItem: {
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "0.9rem",
    borderBottom: "1px solid #eee",
  },

  description: {
    fontSize: "0.9rem",
    color: "#444",
    margin: "0 0 6px 0",
  },
  meta: {
    fontSize: "0.9rem",
    color: "#777",
  },

  // Modal
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  buttonRow: { display: "flex", justifyContent: "flex-end", gap: "10px" },
  button: {
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    background: "#1976d2",
    color: "#fff",
  },
  cancelBtn: {
    background: "#aaa",
  },
};

function timeAgo(dateString) {
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
}

function VideoCard({
  _id,
  thumbnail,
  title,
  description,
  owner,
  avatar,
  views,
  duration,
  createdAt,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHover, setMenuHover] = useState(false);
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

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/video/${_id}`)} // ✅ open VideoPage
    >
      {/* Thumbnail */}
      <div style={styles.thumbnailWrapper}>
        <img src={thumbnail} alt="thumbnail" style={styles.thumbnail} />
        <span style={styles.durationBadge}>{duration}</span>
      </div>

      {/* Avatar + Right Column */}
      <div style={styles.content}>
        <div style={styles.row}>
          <img src={avatar} alt="avatar" style={styles.avatar} />

          <div style={styles.rightColumn}>
            {/* Title + Menu */}
            <div style={styles.titleRow}>
              <h3 style={styles.title}>{title}</h3>
              <button
                style={{
                  ...styles.menuButton,
                  ...(menuHover ? styles.menuButtonHover : {}),
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation(); // ✅ prevent triggering navigate
                  setMenuHover(true);
                }}
                onMouseLeave={() => setMenuHover(false)}
                onClick={(e) => {
                  e.stopPropagation(); // ✅ prevent triggering navigate
                  setMenuOpen(!menuOpen);
                }}
              >
                ⋮
              </button>
              {menuOpen && (
                <div
                  style={styles.menuPopup}
                  onClick={(e) => e.stopPropagation()} // ✅ prevent nav
                >
                  <div
                    style={styles.popupItem}
                    onClick={() => {
                      setShowUpdateModal(true);
                      setMenuOpen(false);
                    }}
                  >
                    Update
                  </div>
                  <div style={styles.popupItem} onClick={handleDelete}>
                    Delete
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <p style={styles.description}>
              {description.length > 60
                ? description.substring(0, 60) + "..."
                : description}
            </p>
            <p style={styles.owner}>{owner}</p>
            {/* Views + Time */}
            <div style={styles.meta}>
              {views ? `${views} views` : "0 views"} • {timeAgo(createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div
          style={styles.modalBackdrop}
          onClick={() => setShowUpdateModal(false)}
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <input
              style={styles.input}
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
            />
            <input
              style={styles.input}
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description"
            />
            <input
              style={styles.input}
              type="file"
              onChange={(e) => setNewThumbnail(e.target.files[0])}
            />
            <div style={styles.buttonRow}>
              <button
                style={{ ...styles.button, ...styles.cancelBtn }}
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>
              <button style={styles.button} onClick={handleUpdateSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoCard;
