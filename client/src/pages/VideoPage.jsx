import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getVideoById, addVideoView } from "../api/videoApi";
import VideoCard from "../components/VideoCard";
import axiosInstance from "../api/axiosInstance";
import { UserContext } from "../context/userContext";
import "../styles/VideoPage.css";

const VideoPage = () => {
  const { videoId } = useParams();
  const { user } = useContext(UserContext);
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

        // Fetch comments
        const commentRes = await axiosInstance.get(`/videos/${videoId}/comments`);
        setComments(commentRes.data);
      } catch (err) {
        console.error("Error fetching video:", err);
      }
    };

    if (videoId) fetchVideo();
  }, [videoId]);

  const handleLike = () => {
    setLikes(likes + 1);
    // TODO: axiosInstance.post(`/videos/${videoId}/like`);
  };

  const handleDislike = () => {
    setDislikes(dislikes + 1);
    // TODO: axiosInstance.post(`/videos/${videoId}/dislike`);
  };

  const handleSubscribe = () => {
    setSubscribed(!subscribed);
    // TODO: axiosInstance.post(`/users/${video.data.owner._id}/subscribe`);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axiosInstance.post(`/videos/${videoId}/comments`, {
        text: newComment,
        userId: user._id,
      });
      setComments([res.data, ...comments]); // prepend new comment
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (!video) return <p>Loading video...</p>;

  return (
    <div className="video-page">
      {/* Main Video Section */}
      <div className="main-video">
        <video
          src={video.data.videoFile}
          controls
          autoPlay
          className="video-player"
        />

        <h2 className="video-title">{video.data.title}</h2>

        <div className="video-info">
          <span>{video.data.views} views</span>
          <span>{new Date(video.data.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="channel-section">
          <div className="channel-info">
            <img
              src={video.data.owner.avatar}
              alt="channel avatar"
              className="channel-avatar"
            />
            <div>
              <h4 className="channel-name">{video.data.owner.username}</h4>
              <p className="channel-subs">1.2K subscribers</p>
            </div>
          </div>
          <button
            onClick={handleSubscribe}
            className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        <div className="video-actions">
          <div className="likes-dislikes">
            <button onClick={handleLike}>👍 {likes}</button>
            <button onClick={handleDislike}>👎 {dislikes}</button>
          </div>
        </div>

        <div className="video-description">
          {showMore
            ? video.data.description
            : video.data.description.slice(0, 150) + "..."}
          {video.data.description.length > 150 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="show-more-btn"
            >
              {showMore ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Comment Section */}
        <div className="comments-section">
          <h3>Comments</h3>
          {user ? (
            <div className="add-comment">
              <img src={user.avatar} alt="user avatar" className="comment-avatar" />
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleAddComment}>Post</button>
            </div>
          ) : (
            <p style={{ color: "#888" }}>Login to add a comment</p>
          )}

          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c._id} className="comment">
                  <img
                    src={c.user.avatar}
                    alt="comment user"
                    className="comment-avatar"
                  />
                  <div className="comment-body">
                    <p className="comment-user">{c.user.username}</p>
                    <p>{c.text}</p>
                    <span className="comment-date">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>

      <div className="recommended-videos">
        <h3>Recommended</h3>
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
          <p>No recommendations</p>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
