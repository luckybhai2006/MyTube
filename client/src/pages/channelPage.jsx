import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ChannelPage = () => {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        // Get user details by username
        const userRes = await axios.get(
          `http://localhost:8000/api/v1/users/C/${username}`,
          { withCredentials: true }
        );
        const user = userRes.data.data;
        setUserInfo(user);

        // Get videos by user._id
        const videoRes = await axios.get(
          `http://localhost:8000/api/v1/videos/user/${user._id}`,
          { withCredentials: true }
        );
        setVideos(videoRes.data || []);

        // Get subscriber count
        const res = await axios.get(
          `http://localhost:8000/api/v1/subscriptions/u/${user._id}`,
          { withCredentials: true }
        );
        setSubscriberCount(res.data.data.length);
      } catch (err) {
        console.error("Failed to load channel", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelDetails();
  }, [username]);

  if (loading) return <p style={styles.loading}>Loading channel...</p>;
  if (!userInfo) return <p style={styles.loading}>Channel not found</p>;

  return (
    <div style={styles.container}>
      <div style={styles.profileSection}>
        <img
          src={userInfo.avatar || "https://via.placeholder.com/100"}
          alt="Avatar"
          style={styles.avatar}
        />
        <div>
          <h2>{userInfo.username}</h2>
          <p>Email: {userInfo.email}</p>
          <p>
            <strong>{subscriberCount}</strong> Subscribers
          </p>
        </div>
      </div>

      <h3 style={styles.videoHeader}>Videos</h3>
      {videos.length === 0 ? (
        <p>No videos uploaded.</p>
      ) : (
        <div style={styles.videoGrid}>
          {videos.map((video) => (
            <div key={video._id} style={styles.videoCard}>
              <video
                src={video.videoFile}
                poster={video.thumbnail}
                controls
                width="100%"
                style={{ borderRadius: "8px" }}
              />
              <h4>{video.title}</h4>
              <p style={styles.videoDesc}>{video.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "20px",
    marginBottom: "30px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  videoHeader: {
    marginBottom: "20px",
  },
  videoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  videoCard: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  videoDesc: {
    fontSize: "0.9rem",
    color: "#555",
    marginTop: "8px",
  },
  loading: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "18px",
  },
};

export default ChannelPage;
