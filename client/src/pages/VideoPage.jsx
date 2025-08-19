import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoById, addVideoView } from "../api/videoApi";
import VideoCard from "../components/VideoCard";
import axiosInstance from "../api/axiosInstance";
import { BiDislike, BiLike } from "react-icons/bi";

const VideoPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        await addVideoView(videoId);
        const res = await getVideoById(videoId);
        setVideo(res.data);

        setLikes(res.data.likes || 0);
        setDislikes(res.data.dislikes || 0);

        const allVideos = await axiosInstance.get("/videos");
        setRecommended(allVideos.data.filter((v) => v._id !== videoId));

        setComments([
          { id: 1, user: "John Doe", text: "Great video!" },
          { id: 2, user: "Jane Smith", text: "Very helpful, thanks!" },
        ]);
      } catch (err) {
        console.error("Error fetching video:", err);
      }
    };

    if (videoId) fetchVideo();
  }, [videoId]);

  const handleLike = () => setLikes((prev) => (prev === 0 ? 1 : prev));
  const handleDislike = () => setDislikes((prev) => (prev === 0 ? 1 : prev));
  const handleSubscribe = () => setSubscribed(!subscribed);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        { id: Date.now(), user: "You", text: newComment },
      ]);
      setNewComment("");
    }
  };

  if (!video) return <p>Loading video...</p>;

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        padding: "16px",
        flexWrap: "wrap",
        background: "#fff",
        color: "#000",
      }}
    >
      {/* Main Video Section */}
      <div style={{ flex: 2, minWidth: "320px" }}>
        <video
          src={video.data.videoFile}
          controls
          autoPlay
          style={{ width: "100%", borderRadius: "10px" }}
        />

        <h2 style={{ margin: "12px 0", color: "#000" }}>{video.data.title}</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            color: "#555",
          }}
        >
          <span>{video.data.views} views</span>
          <span>{new Date(video.data.createdAt).toLocaleDateString()}</span>
        </div>

{/* Channel + Subscribe + Actions */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    flexWrap: "wrap",
    gap: "12px",
  }}
>
  {/* Avatar + Channel Info + Subscribe */}
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    <img
      src={video.data.owner.avatar}
      alt="channel avatar"
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
    <div>
      <h4 style={{ margin: 0, color: "#000" }}>
        {video.data.owner.username}
      </h4>
      <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>
        1.2K subscribers
      </p>
    </div>

    {/* Subscribe Button beside channel name */}
    <button
      onClick={handleSubscribe}
      style={{
        padding: "10px 16px",
        background: subscribed ? "#ccc" : "red",
        border: "none",
        borderRadius: "20px",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
        marginLeft: "12px",
      }}
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  </div>

  {/* Actions Row (like/dislike/share) */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap",
    }}
  >
    <button
      onClick={handleLike}
      style={{
        padding: "6px 12px",
        background: "#f1f1f1",
        border: "1px solid #ddd",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",          
        alignItems: "center",     
        gap: "6px",              
        justifyContent: "center"
      }}><BiLike style={{fontSize:"20px",}}/>{likes}</button>
    <button
      onClick={handleDislike}
      style={{
        padding: "6px 12px",
        background: "#f1f1f1",
        border: "1px solid #ddd",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",          
        alignItems: "center",     
        gap: "6px",              
        justifyContent: "center"
      }}><BiDislike style={{fontSize:"20px",}}/>{dislikes}
    </button>
    <button
      style={{
        padding: "6px 12px",
        background: "#f1f1f1",
        border: "1px solid #ddd",
        borderRadius: "8px",
        cursor: "pointer",
      }}
      onClick={() =>
        navigator.share?.({
          title: video.data.title,
          url: window.location.href,
        })
      }
    >
      🔗 Share
    </button>
  </div>
</div>
        {/* Description */}
        <div
          style={{
            marginTop: "16px",
            background: "#f9f9f9",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#333",
          }}
        >
          {showMore
            ? video.data.description
            : video.data.description.slice(0, 150) + "..."}
          {video.data.description.length > 150 && (
            <button
              onClick={() => setShowMore(!showMore)}
              style={{
                background: "none",
                border: "none",
                color: "#065fd4",
                cursor: "pointer",
                marginLeft: "8px",
              }}
            >
              {showMore ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Comments */}
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#000" }}>Comments</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: "#fff",
                color: "#000",
              }}
            />
            <button
              onClick={handleAddComment}
              style={{
                padding: "8px 16px",
                background: "#065fd4",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Comment
            </button>
          </div>

          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <strong style={{ color: "#000" }}>{c.user}</strong>
              <p style={{ margin: "4px 0", color: "#333" }}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Videos */}
      <div style={{ flex: 1, minWidth: "280px" }}>
        <h3 style={{ color: "#000" }}>Recommended</h3>
        {recommended.length > 0 ? (
          recommended.map((v) => (
            <VideoCard
              key={v._id}
              _id={v._id}
              thumbnail={v.thumbnail}
              duration={v.duration}
              title={v.title}
              description={v.description}
              owner={v.owner.username}
              avatar={v.owner.avatar}
              views={v.views}
              createdAt={v.createdAt}
            />
          ))
        ) : (
          <p style={{ color: "#555" }}>No recommendations</p>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
