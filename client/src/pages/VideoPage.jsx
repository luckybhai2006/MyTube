import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoById, addVideoView } from "../api/videoApi";

const VideoPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Increment views
        await addVideoView(videoId);

        // Fetch video details
        const res = await getVideoById(videoId);
        setVideo(res.data);
      } catch (err) {
        console.error("Error fetching video:", err);
      }
    };

    if (videoId) fetchVideo();
  }, [videoId]);

  if (!video) return <p>Loading video...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <video
        src={video.data.videoFile}
        controls
        autoPlay
        style={{ width: "60%", maxHeight: "65vh" }}
      />
      <h2>{video.data.title}</h2>
      <p>Views: {video.data.views}</p>
      <p>{video.data.description}</p>
    </div>
  );
};

export default VideoPage;
