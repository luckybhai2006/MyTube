// App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
import ResultsPage from "./components/searchResult";
import ChannelPage from "./pages/channelPage";
import SettingsPage from "./components/setting";
import "./App.css";

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // listen for screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // hide navbar on video pages (mobile) AND on settings page (all screens)
  const hideNavbar =
    (isMobile && location.pathname.startsWith("/video/")) ||
    location.pathname === "/settings" ||
    location.pathname === "/login";

  return (
    <VideoProvider>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<UpdateVideo />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/video/:videoId" element={<VideoPage />} />
        <Route path="/watch-history" element={<WatchHistory />} />
        <Route path="/subscriptions" element={<Subscription />} />
        <Route path="/channel/:username" element={<ChannelPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/likedvideoss" element={<LikedVideosPage />} />
      </Routes>
    </VideoProvider>
  );
}

export default AppWrapper;
