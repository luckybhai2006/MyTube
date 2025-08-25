import React, { useState, useEffect } from "react";

const CommentSection = ({ videoId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [menuOpen, setMenuOpen] = useState(null); // track kis comment ka menu open hai

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/comments/${videoId}`,
        { method: "GET", credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setComments(data.data.docs || []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    if (videoId) fetchComments();
  }, [videoId]);

  // Add Comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/comments/${videoId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: newComment }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setComments([data.data, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
    setLoading(false);
  };

  // Delete Comment
  const handleDelete = async (commentId) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/comments/c/${commentId}`,
        { method: "DELETE", credentials: "include" }
      );
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // Start Editing
  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
    setMenuOpen(null); // close menu when editing
  };

  // Save Edited Comment
  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/comments/c/${commentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: editContent }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setComments(
          comments.map((c) =>
            c._id === commentId ? { ...c, content: editContent } : c
          )
        );
        setEditingId(null);
        setEditContent("");
      }
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  return (
    <div style={{ marginTop: "24px", maxWidth: "750px", width: "100%" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>
        {comments.length} Comments
      </h3>

      {/* Add Comment */}
      {user ? (
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <img
            src={user.avatar}
            alt={user.username}
            style={{ width: "36px", height: "36px", borderRadius: "50%" }}
          />
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              style={{
                width: "100%",
                border: "none",
                borderBottom: "1px solid #ccc",
                padding: "6px 2px",
                fontSize: "14px",
                outline: "none",
              }}
            />
            {newComment && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <button
                  onClick={() => setNewComment("")}
                  style={{
                    padding: "6px 12px",
                    fontSize: "13px",
                    borderRadius: "4px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={loading}
                  style={{
                    padding: "6px 12px",
                    fontSize: "13px",
                    borderRadius: "4px",
                    border: "none",
                    color: "white",
                    background: loading ? "#60a5fa" : "#2563eb",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Posting..." : "Comment"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p style={{ fontSize: "13px", color: "#666" }}>Login to comment</p>
      )}

      {/* Comments List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {comments.map((c) => (
          <div key={c._id} style={{ display: "flex", gap: "12px" }}>
            <img
              src={c.owner.avatar}
              alt={c.owner.username}
              style={{ width: "36px", height: "36px", borderRadius: "50%" }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", gap: "6px", alignItems: "center" }}
                >
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>
                    {c.owner.username}
                  </span>
                  <span style={{ fontSize: "11px", color: "#666" }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* 3-dot menu */}
                {user?._id === c.owner._id && (
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() =>
                        setMenuOpen(menuOpen === c._id ? null : c._id)
                      }
                      style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "18px",
                        cursor: "pointer",
                        color: "#666",
                      }}
                    >
                      ⋮
                    </button>
                    {menuOpen === c._id && (
                      <div
                        style={{
                          position: "absolute",
                          right: "0",
                          background: "white",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                          zIndex: 10,
                        }}
                      >
                        <button
                          onClick={() => handleEdit(c)}
                          style={{
                            display: "block",
                            padding: "6px 12px",
                            width: "100%",
                            textAlign: "left",
                            border: "none",
                            background: "white",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          style={{
                            display: "block",
                            padding: "6px 12px",
                            width: "100%",
                            textAlign: "left",
                            border: "none",
                            background: "white",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Edit Mode */}
              {editingId === c._id ? (
                <div>
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{
                      width: "100%",
                      border: "none",
                      borderBottom: "1px solid #ccc",
                      padding: "4px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "6px",
                    }}
                  >
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        fontSize: "12px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(c._id)}
                      style={{
                        fontSize: "12px",
                        padding: "4px 10px",
                        border: "none",
                        borderRadius: "4px",
                        background: "#2563eb",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: "14px", color: "#222", margin: "2px 0" }}>
                  {c.content}
                </p>
              )}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p style={{ fontSize: "13px", color: "#666" }}>No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
