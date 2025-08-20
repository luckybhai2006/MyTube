import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomVideos = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/videos/random"
        );
        setVideos(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching random videos:", error);
        setLoading(false);
      }
    };

    fetchRandomVideos();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading videos...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {videos.map((video) => (
        <Link key={video._id} to={`/video/${video.video?._id}`}>
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
            <video
              src={video.video?.videoFile}
              className="w-full rounded-t-lg"
              controls={false}
            />
            <div className="p-2">
              <h3 className="font-semibold">{video.video?.title}</h3>
              <p className="text-sm text-gray-500">
                {video.video?.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HomePage;
