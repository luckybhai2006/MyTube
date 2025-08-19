import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLikedVideos } from "../api/likeApi";
import "../styles/likedVideosPage.css";

const LikedVideosPage = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Videos");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        const response = await getLikedVideos();
        const videos = response.data || response.data?.data || [];
        setLikedVideos(videos);
      } catch (err) {
        setError("Failed to load liked videos");
      } finally {
        setLoading(false);
      }
    };
    fetchLikedVideos();
  }, []);

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

  const formatViews = (views) => {
    if (!views) return "No views";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  return (
    <div className="liked-videos-layoutt">
      {/* Playlist Info Card */}
      <aside className="playlist-info-cardd">
        <div className="playlist-bannerr">
          <img
            src="https://i.imgur.com/37dZfdd.jpg"
            alt="Liked videos"
            className="banner-imgg"
          />
        </div>
        <div className="playlist-info-contentt">
          <h1 className="playlist-titlee">Liked videos</h1>
          <div className="playlist-metaa">
            <span className="channel-namee">Lulli-Gaming!!</span>
            <span className="video-countt">{likedVideos.length} videos</span>
            <span className="updated-datee">Updated today</span>
          </div>
          <div className="action-roww">
            <button className="playlist-btnn play-all-btn">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width={22}
                height={22}
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Play all
            </button>
            <button className="playlist-btnn shuffle-btn">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width={22}
                height={22}
              >
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
              </svg>
              Shuffle
            </button>
          </div>
        </div>
      </aside>
      {/* Videos Column */}
      <main className="videos-columnn">
        <div className="filter-tabss">
          <div
            className={`tabs ${activeTab === "Videos" ? "active" : ""}`}
            onClick={() => setActiveTab("Videos")}
          >
            Videos
          </div>
          <div
            className={`tabs ${activeTab === "Shorts" ? "active" : ""}`}
            onClick={() => setActiveTab("Shorts")}
          >
            Shorts
          </div>
        </div>
        <div className="videos-listt">
          {loading && (
            <div className="loading-msg">Loading liked videos...</div>
          )}
          {error && <div className="error-msg">{error}</div>}
          {!loading && !error && likedVideos.length === 0 && (
            <div className="empty-state">
              <h2>No liked videos yet</h2>
              <p>Videos you like will appear here</p>
            </div>
          )}
          {!loading &&
            !error &&
            likedVideos.length > 0 &&
            likedVideos.map((video, index) => (
              <div
                key={video._id || video.video?._id || index}
                className="video-itemm"
                tabIndex={0}
                onClick={() =>
                  navigate(`/video/${video.video._id || video.video?._id}`)
                }
              >
                <div className="video-thumbnaill">
                  <img
                    src={
                      video.thumbnail ||
                      video.video?.thumbnail ||
                      "https://via.placeholder.com/168x94"
                    }
                    alt="thumbnail"
                  />
                  <span className="video-durationn">
                    {video.duration || video.video?.duration || "3:53"}
                  </span>
                </div>
                <div className="video-detailss">
                  <h3 className="video-titlee">
                    {video.video?.title || "Untitled Video"}
                  </h3>
                  <div className="video-metaa">
                    <span className="channel-name">
                      {video.video.owner?.username || "Unknown Channel"}
                    </span>
                    <span className="view-count">
                      {formatViews(video.video?.views)}
                    </span>
                    <span className="upload-date">
                      {formatTimeAgo(video.video?.createdAt || "1 year ago")}
                    </span>
                  </div>
                </div>
                <button className="menu-btnn">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width={22}
                    height={22}
                  >
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default LikedVideosPage;
