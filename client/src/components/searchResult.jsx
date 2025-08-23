import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]); // ✅ new
  const [loading, setLoading] = useState(true);

  const query = searchParams.get("search_query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/users/search?q=${query}`,
          { withCredentials: true }
        );
        setVideos(res.data.data.videos || []);
        setUsers(res.data.data.users || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchSearchResults();
  }, [query]);

  if (loading) return <p>Loading search results...</p>;

  if (!videos.length && !users.length)
    return <p>No results found for "{query}"</p>;

  return (
    <div className="responsiveContainerr">
      {/* ✅ Show matching channels */}
      {users.length > 0 && (
        <>
          {/* <h3>Channels</h3> */}
          {users.map((user) => (
            <Link
              key={user._id}
              to={`/channel/${user.username}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginBottom: "16px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={user.username}
                style={{ width: "60px", height: "60px", borderRadius: "50%" }}
              />
              <div>
                <h4 style={{ margin: 0 }}>{user.username}</h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                  {user.email}
                </p>
              </div>
            </Link>
          ))}
        </>
      )}

      {/* ✅ Show matching videos */}
      {videos.length > 0 && (
        <>
          {/* <h3>Videos</h3> */}
          {videos.map((video) => (
            <Link
              key={video._id}
              to={`/video/${video._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="video-card">
                <div className="video-thumbnail">
                  <img
                    src={video.thumbnail || "/default-thumbnail.jpg"}
                    alt={video.title}
                  />
                  <span className="duration-badge">
                    {video.duration || "00:00"}
                  </span>
                </div>

                <div className="video-body">
                  <img
                    src={video.owner?.avatar || "/default-avatar.png"}
                    alt="creator"
                    className="creator-avatar"
                  />
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-owner">
                      {video.owner?.username || "Unknown"}
                    </p>
                    <p className="video-meta">
                      {video.views || 0} views • {video.createdAt}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

export default ResultsPage;
