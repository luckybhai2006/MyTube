import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { useLocation } from "react-router-dom";
import ChannelSuggest from "../pages/ChannleSuggest";
import NProgress from "../pages/Loader";

import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Mic as MicIcon,
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
  Settings as SettingsIcon,
  Help as HelpIcon,
  Feedback as FeedbackIcon,
} from "@mui/icons-material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { SiYoutubeshorts, SiYoutubegaming } from "react-icons/si";
import { MdNewspaper } from "react-icons/md";
import { GrTrophy } from "react-icons/gr";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { PiStudentDuotone } from "react-icons/pi";
import "../styles/navbar.css";

export default function Navbar() {
  const location = useLocation();

  // Only hide the mini sidebar on /video/:videoId pages
  const hideSidebar = location.pathname.startsWith("/video/");
  // const hideNavbar = location.pathname.startsWith("/video/");
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { activeCategory, setActiveCategory } = useContext(UserContext);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const sidebarRef = useRef();
  const searchInputRef = useRef();
  const uploadMenuRef = useRef();
  const userMenuRef = useRef();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [location]);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // load from localStorage once
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSuggestions(saved);
  }, []);
  const onLogout = () => {
    handleLogout();
    setShowUserMenu(false);
    navigate("/login", { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // 🔎 navigate — tumhara hi route pattern
    navigate(`/results?search_query=${encodeURIComponent(searchQuery)}`);

    // 💾 history save (no duplicates, recent first, max 10)
    setSuggestions((prev) => {
      const withoutDup = prev.filter(
        (x) => x.toLowerCase() !== searchQuery.toLowerCase()
      );
      const updated = [searchQuery, ...withoutDup].slice(0, 10);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      return updated;
    });

    setShowSuggestions(false);
    setShowMobileSearch(false);
    // searchQuery reset optional — agar chaho to rakho/hatado
    // setSearchQuery("");
  };
  // close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        uploadMenuRef.current &&
        !uploadMenuRef.current.contains(e.target) &&
        !e.target.closest(".upload-trigger")
      ) {
        setShowUploadMenu(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target) &&
        !e.target.closest(".avatar")
      ) {
        setShowUserMenu(false);
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
        {/* Left Section */}
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
        <div
          className="search-container"
          style={{ position: "relative", flex: 1 }}
        >
          {!showMobileSearch && (
            <>
              {/* Desktop Search */}
              <form
                onSubmit={handleSearch}
                className="desktop-search"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="Search"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      background: "transparent",
                      color: "inherit",
                      border: "none",
                      outline: "none",
                    }}
                  />

                  <button
                    type="submit"
                    className="search-button"
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "6px 10px",
                    }}
                  >
                    <SearchIcon />
                  </button>

                  {/* Desktop Suggestion dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <ul
                      className="suggestion-box"
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "#222",
                        border: "1px solid #333",
                        borderTop: "none",
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        zIndex: 1000,
                        maxHeight: 260,
                        overflowY: "auto",
                      }}
                    >
                      {suggestions
                        .filter((s) =>
                          searchQuery.trim()
                            ? s
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            : true
                        )
                        .map((s, i) => (
                          <li
                            key={i}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setSearchQuery(s);
                              setShowSuggestions(false);
                              navigate(
                                `/results?search_query=${encodeURIComponent(s)}`
                              );
                            }}
                            style={{ padding: "10px 12px", cursor: "pointer" }}
                          >
                            {s}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                <button
                  type="button"
                  className="voice-search-button"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: 8,
                  }}
                >
                  <MicIcon />
                </button>
              </form>

              {/* Mobile icon — RIGHT aligned, hide if panel open */}
              {!showMobileSearch && (
                <button
                  className="mobile-search-button"
                  onClick={() => {
                    setShowMobileSearch(true);
                    setShowSuggestions(false);
                  }}
                  style={{
                    marginLeft: "auto",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <SearchIcon />
                </button>
              )}
            </>
          )}

          {/* Mobile Panel */}
          {showMobileSearch && (
            <div
              className="mobile-search-panel"
              style={{
                position: "fixed",
                inset: 0,
                background: "#f4f4f4",
                zIndex: 2000,
                display: "flex",
                flexDirection: "column",
                padding: 12,
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => setShowMobileSearch(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>

                <form
                  onSubmit={handleSearch}
                  className="mobile-search-expanded"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    // width: "50px",
                    // gap: 180,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flex: 1,
                      background: "#fff",
                      border: "1px solid #000",
                      borderRadius: 24,
                      padding: "6px 10px",
                      width: "90px",
                    }}
                  >
                    {/* <SearchIcon /> */}
                    <input
                      type="text"
                      placeholder="Search"
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 16,
                      }}
                    />
                    <button
                      type="submit"
                      className="search-button"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <SearchIcon />
                    </button>
                  </div>
                </form>
              </div>

              {/* History list */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                {suggestions.length === 0 ? (
                  <div style={{ padding: 14, color: "#666" }}>
                    No recent searches
                  </div>
                ) : (
                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      maxHeight: "60vh",
                      overflowY: "auto",
                    }}
                  >
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        style={{
                          padding: "12px 14px",
                          borderBottom: "1px solid #f1f1f1",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between", // icon + text opposite side
                        }}
                      >
                        <span
                          onClick={() => {
                            setSearchQuery(s);
                            setShowMobileSearch(false);
                            navigate(
                              `/results?search_query=${encodeURIComponent(s)}`
                            );
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flex: 1,
                          }}
                        >
                          <SearchIcon />
                          {s}
                        </span>

                        {/* ❌ Cross icon */}
                        <span
                          onClick={(e) => {
                            e.stopPropagation(); // click bubble prevent
                            setSuggestions((prev) =>
                              prev.filter((item) => item !== s)
                            );
                          }}
                          style={{
                            cursor: "pointer",
                            fontWeight: "bold",
                            marginLeft: 8,
                          }}
                        >
                          ✕
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className={`navbar-right ${showMobileSearch ? "hidden" : ""}`}>
          {/* Upload menu */}
          <div className="upload-trigger hide-triger">
            <AddOutlinedIcon
              className="create-button"
              onClick={() => setShowUploadMenu((prev) => !prev)}
              style={{ cursor: "pointer" }}
            />
            {showUploadMenu && (
              <div
                ref={uploadMenuRef}
                className="upload-menu"
                style={{
                  position: "absolute",
                  top: "40px",
                  right: "0",
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  padding: "10px",
                  zIndex: 500,
                }}
              >
                <Link
                  to={user ? "/upload" : "/login"}
                  style={{
                    display: "block",
                    // padding: "8px 14px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    color: "#000",
                  }}
                  onClick={() => setShowUploadMenu(false)}
                >
                  Upload Video
                </Link>
              </div>
            )}
          </div>

          {/* <AppsIcon className="navbar-icon" /> */}
          <NotificationsIcon className="create-button" />

          {/* Avatar with User Menu */}
          {user ? (
            <div className="user-trigger" style={{ position: "relative" }}>
              <img
                src={user.avatar}
                alt="avatar"
                className="avatar"
                style={{ cursor: "pointer", borderRadius: "50%" }}
                onClick={() => setShowUserMenu((prev) => !prev)}
              />
              {showUserMenu && (
                <div
                  ref={userMenuRef}
                  className="user-menu"
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: "0",
                    background: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    padding: "15px",
                    zIndex: 600,
                    width: "250px",
                  }}
                >
                  {/* User info section */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      src={user.avatar}
                      alt="avatar"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        marginRight: "12px",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: "bold" }}>{user.username}</div>
                      <div style={{ fontSize: "14px", color: "#555" }}>
                        @{user.fullname}
                      </div>
                      <div style={{ fontSize: "12px", color: "#777" }}>
                        {user.email}
                      </div>
                      <Link to="/dashboard">view your channel</Link>
                    </div>
                  </div>

                  <hr style={{ margin: "10px 0", borderColor: "#eee" }} />

                  {/* Logout button */}
                  <button
                    onClick={onLogout}
                    style={{
                      display: "block",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="sign-in-button">
              <Link to="/login">
                <AccountCircleIcon />
              </Link>
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
              onClick={() => setIsSidebarOpen(false)}
            >
              <HomeIcon />
              <span>Home</span>
            </Link>
            <Link
              to="/shorts"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
            >
              <SiYoutubeshorts />
              <span>Shorts</span>
            </Link>
            <Link
              to="/subscriptions"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
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
              onClick={() => setIsSidebarOpen(false)}
            >
              <LibraryIcon />
              <span>Library</span>
            </Link>
            <Link
              to="/dashboard"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
            >
              <VideoCallOutlinedIcon />
              <span>Your Videos</span>
            </Link>
            <Link
              to="/likedvideos"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
            >
              <VideoCallOutlinedIcon />
              <span>Liked Videos</span>
            </Link>

            <Link
              to="/watch-history"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
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
              onClick={() => setIsSidebarOpen(false)}
            >
              <TrendingIcon />
              <span>Trending</span>
            </Link>
            <Link
              to="/music"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
            >
              <IoMusicalNotesOutline />
              <span>Music</span>
            </Link>
            <Link
              to="/gaming"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
            >
              <SiYoutubegaming />
              <span>Gaming</span>
            </Link>
            <Link
              to="/news"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
            >
              <MdNewspaper />
              <span>News</span>
            </Link>
            <Link
              to="/sports"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
            >
              <GrTrophy />
              <span>Sports</span>
            </Link>
            <Link
              to="/learning"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
            >
              <PiStudentDuotone />
              <span>Learning</span>
            </Link>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">More from YouTube</div>
            <Link
              to="/settings"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
            >
              <SettingsIcon />
              <span>Settings</span>
            </Link>
            <Link
              to="/report"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span>Report</span>
            </Link>
            <Link
              to="/help"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
            >
              <HelpIcon />
              <span>Help</span>
            </Link>
            <Link
              to="/feedback"
              className="sidebar-item"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FeedbackIcon />
              <span>Send feedback</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mini Sidebar */}
      {!hideSidebar && (
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
      )}
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      <ChannelSuggest
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      {/* Bottom Navigation - Mobile Only */}
      {/* Bottom Navigation - Mobile Only */}
      {!showMobileSearch && (
        <div className="bottom-nav">
          <Link to="/">
            <HomeIcon />
            <span>Home</span>
          </Link>
          <Link to="/shorts">
            <SiYoutubeshorts size={20} style={{ marginTop: "4px" }} />
            <span>Shorts</span>
          </Link>

          {/* Add/Upload button */}
          <button onClick={() => navigate(user ? "/upload" : "/login")}>
            <AddOutlinedIcon />
            <span>Create</span>
          </button>

          <Link to="/subscriptions">
            <SubscriptionsIcon />
            <span>Subs</span>
          </Link>

          {user ? (
            <Link to="/dashboard">
              <img src={user.avatar} alt="profile" />
              <span>You</span>
            </Link>
          ) : (
            <Link to="/login">
              <AccountCircleIcon />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      )}

      {!hideSidebar && <div className="mini-sidebar">...</div>}
    </>
  );
}
