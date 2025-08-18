import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, Link,useLocation} from "react-router-dom";
import { UserContext } from "../context/userContext";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { SiYoutubeshorts } from "react-icons/si";
import SmartDisplayOutlinedIcon from "@mui/icons-material/SmartDisplayOutlined";
import NProgress from "nprogress";
import "../styles/navbar.css";
import "../styles/nprogress.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuRef = useRef();
  const createRef = useRef();
  const sidebarRef = useRef();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const onLogout = () => {
    handleLogout();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  //loader for nav
useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 500); // simulate small delay for smoother effect

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (createRef.current && !createRef.current.contains(e.target)) {
        setCreateMenuOpen(false);
      }
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.closest(".hamburger")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCreateMenuOpen(false);
  }, [user]);

  return (
    <>
      {/* Sticky Top Navbar */}
      <nav className="sticky-navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={toggleSidebar}>
            <MenuIcon />
          </button>
          <Link to="/" className="logo-container">
            <YouTubeIcon className="youtube-icon" />
            <span className="logo-text">MyTube</span>
          </Link>
        </div>

        <div className="search-container">
          <input type="text" placeholder="Search" className="search-input" />
          <button className="search-button">
            <SearchIcon />
          </button>
        </div>

        <div className="nav-right">
          {user && (
            <div className="create-container" ref={createRef}>
              <button
                className="create-button"
                onClick={() => setCreateMenuOpen(!createMenuOpen)}
              >
                <AddOutlinedIcon />
              </button>
              {createMenuOpen && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setCreateMenuOpen(false);
                      navigate("/upload");
                    }}
                  >
                    Upload Video
                  </div>
                </div>
              )}
            </div>
          )}

          <NotificationsNoneIcon className="notification-icon" />

          {user ? (
            <div className="profile-container" ref={menuRef}>
              <img
                src={user.avatar}
                alt="avatar"
                className="avatar"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="dropdown-menu profile-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/settings");
                    }}
                  >
                    Settings
                  </div>
                  <div className="dropdown-item logout" onClick={onLogout}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">
                <button className="auth-button">Login</button>
              </Link>
              <Link to="/register">
                <button className="auth-button">Register</button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Vertical Sticky Sidebar (always visible) */}
      <div className="vertical-sticky-sidebar">
        <Link to="/" className="sidebar-icon-item">
          <HomeIcon />
          {/* <span>Home</span> */}
        </Link>
        <Link to="/dashboard" className="sidebar-icon-item">
          <SmartDisplayOutlinedIcon />
          {/* <span>Videos</span> */}
        </Link>
        <Link to="/shorts" className="sidebar-icon-item">
          <SiYoutubeshorts />
          {/* <span>Shorts</span> */}
        </Link>
        <Link to="/subscriptions" className="sidebar-icon-item">
          <SubscriptionsIcon />
          {/* <span>Subs</span> */}
        </Link>
        <Link to="/library" className="sidebar-icon-item">
          <LibraryAddIcon />
          {/* <span>Library</span> */}
        </Link>
      </div>

      {/* Expandable Sidebar (opens on hamburger click) */}
      <div
        className={`expandable-sidebar ${isSidebarOpen ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="sidebar-content">
          <div className="sidebar-header">
            <button className="hamburger" onClick={toggleSidebar}>
              <MenuIcon />
            </button>
            <Link to="/" className="logo-container">
              <YouTubeIcon className="youtube-icon" />
              <span className="logo-text">MyTube</span>
            </Link>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Main</h3>
            <Link to="/" className="sidebar-item">
              <HomeIcon className="sidebar-icon" />
              <span>Home</span>
            </Link>
            <Link to="/dashboard" className="sidebar-item">
              <SmartDisplayOutlinedIcon className="sidebar-icon" />
              <span>Your Videos</span>
            </Link>
            <Link to="/shorts" className="sidebar-item">
              <SiYoutubeshorts className="sidebar-icon" />
              <span>Shorts</span>
            </Link>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Subscriptions</h3>
            <Link to="/subscriptions" className="sidebar-item">
              <SubscriptionsIcon className="sidebar-icon" />
              <span>Subscriptions</span>
            </Link>
            <Link to="/library" className="sidebar-item">
              <LibraryAddIcon className="sidebar-icon" />
              <span>Library</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
    </>
  );
}
