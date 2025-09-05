import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getVideoById, addVideoView } from "../api/videoApi";
import VideoCard from "../components/VideoCard";
import RecommendedVideoCard from "../components/recommendedVideoCard";
import axiosInstance from "../api/axiosInstance";
import { BiDislike, BiLike } from "react-icons/bi";
import { toggleVideoLike, getLikedVideos } from "../api/likeApi";
import { addToWatchHistory } from "../api/userApi";
import SubscribeButton from "../pages/subscribeButton";
import { UserContext } from "../context/userContext";
import CommentSection from "../pages/commentSection";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
import "../styles/VideoPage.css";

const VideoPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [addedToHistory, setAddedToHistory] = useState(false);
  const { user } = useContext(UserContext);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // ✅ Main video
        await addVideoView(videoId);
        const res = await getVideoById(videoId);
        const videoData = res.data.data || res.data;
        setVideo(videoData);

        // ✅ Subscriber count (skip if not logged in)
        const ownerId = videoData?.owner?._id;
        if (ownerId) {
          try {
            const subsRes = await axios.get(
              `${API_URL}/api/v1/subscriptions/u/${ownerId}`
            );
            setSubscriberCount(subsRes.data.data.length);
          } catch {
            setSubscriberCount(0); // not logged in
          }
        }

        setLikes(videoData.likes || 0);
        setDislikes(videoData.dislikes || 0);

        // ✅ Check if user liked (skip if not logged in)
        try {
          const likedVideosRes = await getLikedVideos();
          const likedVideos =
            likedVideosRes.data.data || likedVideosRes.data || [];
          const isLiked = likedVideos.some(
            (like) => like.video?._id === videoId
          );
          setLiked(isLiked);
        } catch {
          setLiked(false);
        }

        // ✅ Recommended videos (independent of user login)
        if (videoData?.category) {
          try {
            const recRes = await axios.get(
              `${API_URL}/api/v1/videos/category?category=${videoData.category}`
            );

            const recVideos = Array.isArray(recRes.data)
              ? recRes.data
              : recRes.data?.data || [];

            const filtered = recVideos.filter(
              (v) => v._id && v._id !== videoId
            );

            setRecommended(filtered);
          } catch (err) {
            console.error("❌ Error fetching recommended videos:", err);
          }
        } else {
          console.warn(
            "⚠️ videoData.category missing, recommend API skip ho gaya"
          );
        }
      } catch (err) {
        console.error("❌ Error fetching video:", err);
      }
    };

    if (videoId) {
      setAddedToHistory(false);
      fetchVideo();
    }
  }, [videoId]);

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
    if (e.target.currentTime >= 5) handleAddToHistory();
  };

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
    setDislikes((prev) => (prev === 0 ? 1 : prev));
  };

  if (!video) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="videoPageContainer_vpg">
      {/* Main Video Section */}
      <div className="videoSection_vpg">
        <video
          src={video.videoFile || video.data?.videoFile}
          controls
          onTimeUpdate={handleTimeUpdate}
          autoPlay
          className="videoPlayer_vpg"
        />
        <div className="middle-section">
          <h2 className="videoTitle_vpg">{video.title}</h2>

          <div className="videoMeta_vpg">
            <span>{video.views} views</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Channel + Subscribe + Actions */}
          <div className="channelSection_vpg">
            <div className="channelInfoWrapper_vpg">
              <Link
                to={`/channel/${video.owner?.username}`}
                className="channelLink_vpg"
              >
                <img
                  src={video.owner?.avatar}
                  alt="channel avatar"
                  className="channelAvatar_vpg"
                />
                <div>
                  <h4 className="channelName_vpg">{video.owner?.username}</h4>
                  <p className="subscriberCount_vpg">
                    {subscriberCount} subscribers
                  </p>
                </div>
              </Link>

              {video.owner?._id && (
                <SubscribeButton channelId={video.owner._id} />
              )}
            </div>

            <div className="actionButtons_vpg">
              <button
                onClick={handleLike}
                className={`likeButton_vpg ${liked ? "liked_vpg" : ""}`}
              >
                <BiLike /> {likes}
              </button>
              <button onClick={handleDislike} className="dislikeButton_vpg">
                <BiDislike /> {dislikes}
              </button>
              <button
                className="shareButton_vpg"
                onClick={() =>
                  navigator.share?.({
                    title: video.title,
                    url: window.location.href,
                  })
                }
              >
                🔗 Share
              </button>
            </div>
          </div>

          <div className="videoDescription_vpg">
            {showMore
              ? video.description
              : (video.description || "").slice(0, 120) + "..."}
            {video.description?.length > 120 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="showMoreBtn_vpg"
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          <CommentSection videoId={video._id} user={user} />
        </div>
      </div>

      {/* Recommended Videos */}
      <div className="recommendedSection_vpg">
        <h3>Recommended</h3>
        {recommended.length > 0 ? (
          recommended.map((v) =>
            v._id ? (
              <RecommendedVideoCard
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
            ) : null
          )
        ) : (
          <p>No recommendations</p>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
