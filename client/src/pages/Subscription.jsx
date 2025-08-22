import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom"; // import Link

const Subscription = () => {
  const { user } = useContext(UserContext);
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      if (!user?._id) return;

      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/subscriptions/c/${user._id}`,
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

  return (
    <div>
      <h2>Subscribed Channels</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {subscribedChannels.map((sub) => (
          <li key={sub.channel._id} style={{ margin: "10px 0" }}>
            <Link
              to={`/channel/${sub.channel.username}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "8px",
                  marginLeft: "60px",
                  marginTop: "60px",
                }}
              >
                <img
                  src={sub.channel.avatar || "https://via.placeholder.com/50"}
                  alt="Avatar"
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                />
                <div>
                  <h4 style={{ margin: 0 }}>{sub.channel.username}</h4>
                  <p style={{ margin: 0 }}>{sub.channel.email}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subscription;
