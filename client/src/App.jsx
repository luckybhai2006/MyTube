// import { UserProvider } from "./context/userContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/ownerDashbord";
import LikedVideosPage from "./pages/likedVideo";
import Home from "./pages/Home";
import UpdateVideo from "./pages/UploadVideo";
import VideoPage from "./pages/VideoPage";
import ProtectedRoute from "./components/protectedRout";

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Navbar must be inside BrowserRouter */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<UpdateVideo />} />
        <Route path="/video/:videoId" element={<VideoPage />} />
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
    </BrowserRouter>
  );
}
export default App;
