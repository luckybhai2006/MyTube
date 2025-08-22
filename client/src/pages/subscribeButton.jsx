import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";

const SubscribeButton = ({ channelId, initialSubscriberCount = 0 }) => {
  const { user } = useContext(UserContext);

  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [subscriberCount, setSubscriberCount] = useState(
  // initialSubscriberCount
  // );

  useEffect(() => {
    if (!user || !channelId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchSubscriptionStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/subscriptions/c/${user._id}`,
          { withCredentials: true }
        );
        const subscribedChannels = res.data.data || [];
        const isSubscribed = subscribedChannels.some(
          (sub) => sub.channel._id === channelId
        );
        if (isMounted) {
          setSubscribed(isSubscribed);
        }
      } catch (error) {
        console.error("Failed to fetch subscriptions", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSubscriptionStatus();

    return () => {
      isMounted = false;
    };
  }, [user, channelId]);

  const handleSubscribeToggle = async () => {
    if (!user) {
      alert("Please login to subscribe");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:8000/api/v1/subscriptions/c/${channelId}`,
        {},
        { withCredentials: true }
      );

      setSubscribed((prev) => {
        // setSubscriberCount();
        return !prev;
      });
    } catch (error) {
      console.error("Subscription toggle failed", error);
      alert("Could not update subscription");
    } finally {
      setLoading(false);
    }
  };

  if (!channelId || user?._id === channelId) return null;

  return (
    <button
      onClick={handleSubscribeToggle}
      disabled={loading}
      style={{
        padding: "10px 16px",
        background: subscribed ? "#ccc" : "red",
        border: "none",
        borderRadius: "20px",
        color: "#fff",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
      // title={`${subscriberCount} subscribers`}
    >
      {loading ? "Loading..." : subscribed ? "Subscribed" : "Subscribe"}
      {/* <span>({subscriberCount})</span> */}
    </button>
  );
};

export default SubscribeButton;
