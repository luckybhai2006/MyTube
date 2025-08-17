import React, { useState } from "react";
import { updateVideo, deleteVideo } from "../api/videoApi";

const styles = {
  card: {
    width: "290px",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    cursor: "pointer",
    position: "relative",
    marginTop: "13px",
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
    bottom: "10px",
    right: "7px",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: "500",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  content: { padding: "4px" },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "-10px",
  },
  title: { fontSize: "1rem", fontWeight: "bold", margin: 0 },
  menuButton: {
    height: "30px",
    width: "30px",
    background: "transparent",
    border: "none",
    fontSize: "1.2rem",
    color: "#555",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "100%",
    transition: "background-color 0.2s ease", // hover transition
  },
  menuButtonHover: {
    backgroundColor: "rgba(0,0,0,0.3)", // hover effect
  },
  menuPopup: {
    position: "absolute",
    top: "40px",
    right: "10px",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    borderRadius: "6px",
    zIndex: 10,
  },
  popupItem: {
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "0.9rem",
    borderBottom: "1px solid #eee",
  },
  description: { fontSize: "0.875rem", color: "#aaa", marginBottom: "8px" },
  owner: { fontSize: "0.9rem", color: "#121212" },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "3px",
    verticalAlign: "middle",
  },
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modal: {
    background: "#1e1e1e",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    color: "#fff",
  },
  input: {
    padding: "8px",
    fontSize: "0.9rem",
    borderRadius: "5px",
    border: "1px solid #555",
    backgroundColor: "#121212",
    color: "#fff",
  },
  buttonRow: { display: "flex", justifyContent: "flex-end", gap: "10px" },
  button: {
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
  },
};

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
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
  const [menuHover, setMenuHover] = useState(false); // hover state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newThumbnail, setNewThumbnail] = useState(null);

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
      { label: "minute", seconds: 60 },
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

  return (
    <div style={styles.card}>
      {/* Thumbnail with duration */}
      <div style={styles.thumbnailWrapper}>
        <img src={thumbnail} alt={title} style={styles.thumbnail} />
        <span style={styles.durationBadge}>
          {duration ? formatDuration(duration) : "0:00"}
        </span>
      </div>

      {/* Title and menu */}
      <div style={styles.content}>
        <div style={styles.titleRow}>
          <h3 style={styles.title}>{title}</h3>
          <button
            onMouseEnter={() => setMenuHover(true)}
            onMouseLeave={() => setMenuHover(false)}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              ...styles.menuButton,
              ...(menuHover ? styles.menuButtonHover : {}),
            }}
          >
            ⋮
          </button>
          {menuOpen && (
            <div style={styles.menuPopup}>
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

        <p style={styles.description}>{description}</p>
        <span style={styles.owner}>
          <img src={avatar} alt="avatar" style={styles.avatar} /> {owner}{" "}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {views ? `${views} views` : "0 views"} • {timeAgo(createdAt)}
        </span>
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
                style={styles.button}
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
