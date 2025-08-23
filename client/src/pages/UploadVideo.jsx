import React, { useState } from "react";
import { publishVideo } from "../api/videoApi"; // <-- your API function
import { useNavigate } from "react-router-dom";
import "../styles/leftDashboard.css";

export default function UploadVideo() {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);
  const [isPublished, setIsPublished] = useState(false);

  const navigate = useNavigate();

  // extract video duration before uploading
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);

    if (file) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        setDuration(video.duration.toFixed(2)); // set duration in seconds
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !thumbnail || !title || !description) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("isPublished", isPublished);

    try {
      await publishVideo(formData);
      alert("Video uploaded successfully!");
      navigate("/"); // redirect to home or video page
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload video");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="upload-container">
        <h2>Upload Video</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Video File:</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              required
            />
          </div>
          <div>
            <label>Thumbnail:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              required
            />
          </div>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>
              Publish Now?
              <input
                type="checkbox"
                checked={isPublished}
                onChange={() => setIsPublished(!isPublished)}
              />
            </label>
          </div>
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}
