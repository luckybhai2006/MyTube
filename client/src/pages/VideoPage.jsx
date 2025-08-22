import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getVideoById, addVideoView } from "../api/videoApi";
import VideoCard from "../components/VideoCard";
import axiosInstance from "../api/axiosInstance";
import { BiDislike, BiLike } from "react-icons/bi";
import { toggleVideoLike, getLikedVideos } from "../api/likeApi";
import { addToWatchHistory } from "../api/userApi";
import SubscribeButton from "../pages/subscribeButton";
import { UserContext } from "../context/userContext";
import axios from "axios";
import "../styles/VideoPage.css";

const VideoPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState(false);
  // const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [addedToHistory, setAddedToHistory] = useState(false); // prevent multiple calls
  const { user } = useContext(UserContext); // or from Redux selector
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        await addVideoView(videoId);

        const res = await getVideoById(videoId);
        const videoData = res.data.data || res.data;
        setVideo(videoData);

        // ✅ Fetch subscriber count of the video owner
        const ownerId = videoData?.owner?._id;
        if (ownerId) {
          try {
            const subsRes = await axios.get(
              `http://localhost:8000/api/v1/subscriptions/u/${ownerId}`,
              { withCredentials: true }
            );
            setSubscriberCount(subsRes.data.data.length);
          } catch (err) {
            console.error(
              "Failed to fetch subscriber count:",
              err.response?.data?.message || err.message
            );
            setSubscriberCount(0); // optional fallback
          }
        }

        // ✅ Likes/Dislikes
        setLikes(videoData.likes || 0);
        setDislikes(videoData.dislikes || 0);

        // ✅ Check if user liked this video
        const likedVideosRes = await getLikedVideos();
        const likedVideos =
          likedVideosRes.data.data || likedVideosRes.data || [];
        const isLiked = likedVideos.some((like) => like.video?._id === videoId);
        setLiked(isLiked);

        // ✅ Recommended videos
        const allVideosRes = await axiosInstance.get("/videos");
        const allVideos = allVideosRes.data.data || allVideosRes.data;

        if (Array.isArray(allVideos)) {
          setRecommended(allVideos.filter((v) => v._id !== videoId));
        } else {
          setRecommended([]);
          console.warn("Expected an array for allVideos but got:", allVideos);
        }

        // ✅ Sample comments
        setComments([
          { id: 1, user: "John Doe", text: "Great video!" },
          { id: 2, user: "Jane Smith", text: "Very helpful, thanks!" },
        ]);
      } catch (err) {
        console.error("Error fetching video:", err);
      }
    };

    if (videoId) {
      setAddedToHistory(false); // reset when video changes
      fetchVideo();
    }
  }, [videoId]);

  // Add video to watch history after 5 seconds of playback
  const handleAddToHistory = async () => {
    if (!addedToHistory && video) {
      try {
        await addToWatchHistory(video._id);
        setAddedToHistory(true);
      } catch (err) {
        console.error("Watch history error:", err);
      }
    }
  };

  const handleTimeUpdate = (e) => {
    const currentTime = e.target.currentTime;
    if (currentTime >= 5) {
      handleAddToHistory();
    }
  };

  // Toggle like
  const handleLike = async () => {
    try {
      const res = await toggleVideoLike(videoId);
      const data = res.data.data || res.data;

      if (data.likes !== undefined) setLikes(data.likes);
      setLiked(data.liked);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDislike = () => {
    // Placeholder for future dislike API
    setDislikes((prev) => (prev === 0 ? 1 : prev));
  };

  // const handleSubscribe = () => setSubscribed(!subscribed);

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
      className="my-container"
    >
      {/* Main Video Section */}
      <div style={{ flex: 2, minWidth: "320px" }}>
        <video
          src={video.videoFile || video.data?.videoFile}
          controls
          onTimeUpdate={handleTimeUpdate}
          autoPlay
          style={{ width: "100%", borderRadius: "10px" }}
        />

        <h2 style={{ margin: "12px 0", color: "#000" }}>
          {video.title || video.data?.title}
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            color: "#555",
          }}
        >
          <span>{video.views || video.data?.views} views</span>
          <span>
            {new Date(
              video.createdAt || video.data?.createdAt
            ).toLocaleDateString()}
          </span>
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={video.owner?.avatar || video.data?.owner?.avatar}
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
                {video.owner?.username || video.data?.owner?.username}
              </h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>
                {subscriberCount} subscribers
              </p>
            </div>

            {(video.owner?._id || video.data?.owner?._id) && (
              <SubscribeButton
                channelId={video.owner?._id || video.data?.owner?._id}
              />
            )}
          </div>

          {/* Actions Row */}
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
                background: liked ? "#065fd4" : "#f1f1f1",
                color: liked ? "#fff" : "#000",
                border: "1px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                justifyContent: "center",
              }}
            >
              <BiLike style={{ fontSize: "20px" }} />
              {likes}
            </button>

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
                justifyContent: "center",
              }}
            >
              <BiDislike style={{ fontSize: "20px" }} />
              {dislikes}
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
                  title: video.title || video.data?.title,
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
            ? video.description || video.data?.description
            : (video.description || video.data?.description || "").slice(
                0,
                150
              ) + "..."}
          {(video.description || video.data?.description || "").length >
            150 && (
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
              owner={v.owner?.username}
              avatar={v.owner?.avatar}
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
