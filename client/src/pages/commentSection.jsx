import React, { useState, useEffect, useRef } from "react";
import "../styles/comment.css";

const CommentSection = ({ videoId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [closing, setClosing] = useState(false);

  const closeDrawer = () => {
    setClosing(true); // 👈 pehle closing true kar do
    setTimeout(() => {
      setDrawerOpen(false); // 👈 actual close thoda delay se
      setClosing(false);
      document.body.classList.remove("drawer-open");
    }, 300); // transition time
  };

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0) {
      drawerRef.current.style.transform = `translateY(${diff}px)`; // drawer moves with finger
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;

    if (diff > 120) {
      // dragged down enough → close drawer
      setDrawerOpen(false);
    } else {
      // reset position
      drawerRef.current.style.transform = `translateY(0)`;
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/comments/${videoId}`,
        { method: "GET", credentials: "include" }
      );
      const data = await res.json();
      if (data.success) setComments(data.data.docs || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    if (videoId) fetchComments();
  }, [videoId]);

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

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/comments/c/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setEditContent(c.content);
    setMenuOpen(null);
  };

  const handleSaveEdit = async (id) => {
    if (!editContent.trim()) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/comments/c/${id}`,
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
            c._id === id ? { ...c, content: editContent } : c
          )
        );
        setEditingId(null);
        setEditContent("");
      }
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  // ✅ Reusable comment list
  const renderComments = () => (
    <div className="comment-list">
      {comments.map((c) => (
        <div key={c._id} className="comment-item">
          <img src={c.owner.avatar} alt={c.owner.username} />
          <div className="comment-body">
            <div className="comment-header">
              <div className="comment-user">
                <span>{c.owner.username}</span>
                <span className="comment-date">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              {user?._id === c.owner._id && (
                <div className="comment-menu">
                  <button
                    onClick={() =>
                      setMenuOpen(menuOpen === c._id ? null : c._id)
                    }
                  >
                    ⋮
                  </button>
                  {menuOpen === c._id && (
                    <div className="comment-dropdown">
                      <button onClick={() => handleEdit(c)}>Edit</button>
                      <button onClick={() => handleDelete(c._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {editingId === c._id ? (
              <div>
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="comment-actions">
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                  <button onClick={() => handleSaveEdit(c._id)}>Save</button>
                </div>
              </div>
            ) : (
              <p className="comment-content">{c.content}</p>
            )}
          </div>
        </div>
      ))}
      {comments.length === 0 && (
        <p style={{ fontSize: "13px", color: "#666" }} className="no-cmmt">
          No comments yet
        </p>
      )}
    </div>
  );

  return (
    <div className="comment-section">
      {/* ✅ Desktop comments (inline) */}
      <div className="desktop-comments">
        <h3>{comments.length} Comments</h3>

        {user ? (
          <div className="comment-input-wrapper">
            <img src={user.avatar} alt={user.username} />
            <div className="comment-input-box">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              {newComment && (
                <div className="comment-actions">
                  <button onClick={() => setNewComment("")}>Cancel</button>
                  <button onClick={handleAddComment} disabled={loading}>
                    {loading ? "Posting..." : "Comment"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p style={{ fontSize: "13px", color: "#666" }}>Login to comment</p>
        )}

        {renderComments()}
      </div>

      {/* ✅ Mobile version (drawer button only) */}
      <div className="mobile-comments">
        <button
          onClick={() => {
            document.body.classList.add("drawer-open"); // 🚀 prevent body scroll
            setDrawerOpen(true);
          }}
          className="comment-preview-btn"
        >
          <div className="comment-count">Comments {comments.length}</div>

          {comments.length > 0 ? (
            <div className="comment-preview-body">
              <img
                src={
                  comments[comments.length - 1]?.owner?.avatar ||
                  comments[comments.length - 1]?.user?.avatar ||
                  "/default-avatar.png"
                }
                alt="avatar"
                className="comment-preview-avatar"
              />
              <div className="comment-preview-texts">
                <span className="comment-preview-text">
                  {comments[comments.length - 1]?.content ||
                    comments[comments.length - 1]?.text ||
                    ""}
                </span>
              </div>
            </div>
          ) : (
            <div className="comment-preview-body">
              <span className="comment-preview-text" style={{ color: "#666" }}>
                Add a comment...
              </span>
            </div>
          )}
        </button>

        {drawerOpen && (
          <div className="drawer-overlay" onClick={closeDrawer}>
            <div
              className={`drawer ${closing ? "closing" : "open"}`}
              ref={drawerRef}
              onClick={(e) => e.stopPropagation()} // stop overlay click
            >
              {/* Drawer Handle */}
              <div
                className="drawer-handle"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              ></div>

              <h3 style={{ marginBottom: "12px" }}>
                {comments.length} Comments
              </h3>

              {/* Comments List */}
              <div className="comments-list">{renderComments()}</div>

              {/* ✅ Fixed Add Comment Bar */}
              <div className="comment-input-fixed">
                {user ? (
                  <div className="comment-input-wrapper">
                    <img src={user.avatar} alt={user.username} />
                    <div className="comment-input-box">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                      />
                      {newComment && (
                        <div className="comment-actions">
                          <button onClick={() => setNewComment("")}>
                            Cancel
                          </button>
                          <button onClick={handleAddComment} disabled={loading}>
                            {loading ? "Posting..." : "Comment"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: "13px", color: "#666" }}>
                    Login to comment
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
