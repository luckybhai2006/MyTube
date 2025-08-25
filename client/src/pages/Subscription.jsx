import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom"; // import Link
const API_URL = import.meta.env.VITE_API_URL;
import "../styles/VideoCard.css";
const Subscription = () => {
  const { user } = useContext(UserContext);
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      if (!user?._id) return;

      try {
        const res = await axios.get(
          `${API_URL}/api/v1/subscriptions/c/${user._id}`,
          { withCredentials: true }
        );
        setSubscribedChannels(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch subscribed channels", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribedChannels();
  }, [user]);

  if (loading) return <div>Loading subscribed channels...</div>;

  if (subscribedChannels.length === 0)
    return <div>You haven't subscribed to any channels yet.</div>;
   const gradients = [
    "linear-gradient(135deg, #fdfbfb, #ebedee)",
    "linear-gradient(135deg, #fff5f5, #fceaea)",
    "linear-gradient(135deg, #f7f9fc, #e9edf5)",
    "linear-gradient(135deg, #fefcfb, #f5f3f0)"
  ];

  return (
    <div className="responsiveContainerr">
      {subscribedChannels.map((sub,index) => (
        <Link
          key={sub.channel._id}
          to={`/channel/${sub.channel.username}`}
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
             background: gradients[index % gradients.length],
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
          }}
            onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";
          }}
        >
          <img
            src={sub.channel.avatar || "/default-avatar.png"}
            alt={sub.channel.username}
            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
          />
          <div>
            <h4 style={{ margin: 0 }}>{sub.channel.username}</h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
              {sub.channel.email}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Subscription;
