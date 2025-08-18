import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";

import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Mic as MicIcon,
  VideoCall as VideoCallIcon,
  Notifications as NotificationsIcon,
  Apps as AppsIcon,
  AccountCircle as AccountCircleIcon,
  YouTube as YouTubeIcon,
  Home as HomeIcon,
  Subscriptions as SubscriptionsIcon,
  ArrowBack as ArrowBackIcon,
  Whatshot as TrendingIcon,
  History as HistoryIcon,
  LibraryMusic as LibraryIcon,
  // SportsEsports as GamingIcon,
  // News as NewsIcon,
  // EmojiEvents as SportsIcon,
  // Lightbulb as LearningIcon,
  Settings as SettingsIcon,
  // Flag as ReportIcon,
  Help as HelpIcon,
  Feedback as FeedbackIcon,
} from "@mui/icons-material";
import { SiYoutubeshorts } from "react-icons/si";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Changed to true by default
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuRef = useRef();
  const sidebarRef = useRef();
  const searchInputRef = useRef();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const onLogout = () => {
    handleLogout();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results?search_query=${encodeURIComponent(searchQuery)}`);
      setShowMobileSearch(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
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
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  return (
    <>
      {/* Main Navbar */}
      <nav className={`navbar ${showMobileSearch ? "search-active" : ""}`}>
        {/* Left Section - Always visible */}
        <div className="navbar-left">
          {!showMobileSearch ? (
            <>
              <button className="hamburger" onClick={toggleSidebar}>
                <MenuIcon />
              </button>
              <Link to="/" className="logo-container">
                <YouTubeIcon className="youtube-icon" />
                <span className="logo-text">MyTube</span>
              </Link>
            </>
          ) : (
            <button
              className="back-button"
              onClick={() => setShowMobileSearch(false)}
            >
              <ArrowBackIcon />
            </button>
          )}
        </div>

        {/* Middle Section - Search */}
        <div className="search-container">
          {!showMobileSearch ? (
            <>
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="desktop-search">
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="Search"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="search-button">
                    <SearchIcon />
                  </button>
                </div>
                <button type="button" className="voice-search-button">
                  <MicIcon />
                </button>
              </form>

              {/* Mobile Search Button */}
              <button
                className="mobile-search-button"
                onClick={() => setShowMobileSearch(true)}
              >
                <SearchIcon />
              </button>
            </>
          ) : (
            <form onSubmit={handleSearch} className="mobile-search-expanded">
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
              />
            </form>
          )}
        </div>

        {/* Right Section - Hidden when search is active on mobile */}
        <div className={`navbar-right ${showMobileSearch ? "hidden" : ""}`}>
          <VideoCallIcon className="navbar-icon" />
          <AppsIcon className="navbar-icon" />
          <NotificationsIcon className="navbar-icon" />
          {user ? (
            <div className="profile-container" ref={menuRef}>
              <img
                src={user.avatar}
                alt="avatar"
                className="avatar"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="dropdown-avatar"
                    />
                    <div className="dropdown-user-info">
                      <span className="dropdown-username">{user.name}</span>
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item">
                    <AccountCircleIcon />
                    <span>Your channel</span>
                  </div>
                  <div className="dropdown-item" onClick={() => handleLogout()}>
                    <span>Sign out</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="sign-in-button">
              <AccountCircleIcon />
              <Link to="/login">SIGN IN</Link>
            </button>
          )}
        </div>
      </nav>
      {/* Sidebar */}
      <div
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="sidebar-content">
          <div className="sidebar-section">
            <Link
              to="/"
              className="sidebar-item active"
              onClick={() => setIsSidebarOpen()}
            >
              <HomeIcon />
              <span>Home</span>
            </Link>
            <Link
              to="/shorts"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              <SiYoutubeshorts />
              <span>Shorts</span>
            </Link>
            <Link
              to="/subscriptions"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              <SubscriptionsIcon />
              <span>Subscriptions</span>
            </Link>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">You</div>
            <Link
              to="/library"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              <LibraryIcon />
              <span>Library</span>
            </Link>
            <Link
              to="/dashboard"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              <VideoCallOutlinedIcon />
              <span>Your Videos</span>
            </Link>
            <Link
              to="/history"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              <HistoryIcon />
              <span>History</span>
            </Link>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">Explore</div>
            <Link
              to="/trending"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              <TrendingIcon />
              <span>Trending</span>
            </Link>
            <Link
              to="/music"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              {/* <LibraryMusic /> */}
              <span>Music</span>
            </Link>
            <Link
              to="/gaming"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              {/* <SportsEsports /> */}
              <span>Gaming</span>
            </Link>
            <Link
              to="/news"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              {/* <NewsIcon /> */}
              <span>News</span>
            </Link>
            <Link
              to="/sports"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              {/* <EmojiEvents /> */}
              <span>Sports</span>
            </Link>
            <Link
              to="/learning"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              {/* <Lightbulb /> */}
              <span>Learning</span>
            </Link>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">More from YouTube</div>
            <Link
              to="/settings"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              <SettingsIcon />
              <span>Settings</span>
            </Link>
            <Link
              to="/report"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              {/* <Flag /> */}
              <span>Report</span>
            </Link>
            <Link
              to="/help"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              <HelpIcon />
              <span>Help</span>
            </Link>
            <Link
              to="/feedback"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen()}
            >
              <FeedbackIcon />
              <span>Send feedback</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mini Sidebar (Icons Only) */}
      <div className="mini-sidebar">
        <Link to="/" className="mini-sidebar-item">
          <HomeIcon />
          <span>Home</span>
        </Link>
        <Link to="/shorts" className="mini-sidebar-item">
          <SiYoutubeshorts />
          <span>Shorts</span>
        </Link>
        <Link to="/subscriptions" className="mini-sidebar-item">
          <SubscriptionsIcon />
          <span>Subs</span>
        </Link>
        <Link className="mini-sidebar-item">
          <LibraryIcon />
          <span>Library</span>
        </Link>
      </div>

      {/* Overlays */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
}
