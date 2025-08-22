// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/ownerDashbord";
import LikedVideosPage from "./pages/likedVideo";
import Home from "./pages/Home";
import UpdateVideo from "./pages/UploadVideo";
import WatchHistory from "./pages/WatchHistory";
import VideoPage from "./pages/VideoPage";
import ProtectedRoute from "./components/protectedRout";
import Subscription from "./pages/Subscription";
import { VideoProvider } from "./context/videoContext";
import ChannelPage from "./pages/channelPage";
function App() {
  return (
    <BrowserRouter>
      {/* ✅ Provider must wrap Routes */}
      <VideoProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<UpdateVideo />} />
          <Route path="/video/:videoId" element={<VideoPage />} />
          <Route path="/watch-history" element={<WatchHistory />} />
          <Route path="/subscriptions" element={<Subscription />} />
          <Route path="/channel/:username" element={<ChannelPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/likedvideos"
            element={
              <ProtectedRoute>
                <LikedVideosPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </VideoProvider>
    </BrowserRouter>
  );
}

export default App;
