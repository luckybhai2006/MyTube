import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
import "../styles/app.css";
import "../styles/leftDashboard.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [hoverCreate, setHoverCreate] = useState(false);
  const menuRef = useRef();
  const createRef = useRef();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const onLogout = () => {
    handleLogout();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (createRef.current && !createRef.current.contains(e.target)) {
        setCreateMenuOpen(false);
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
    <nav className="nav">
      <div style={{ display: "flex", alignItems: "center" }}>
        <button className="hamburger" onClick={toggleSidebar}>
          <MenuIcon style={{ fontSize: "32px" }} />
        </button>
        <YouTubeIcon style={{fontSize:"40px" , color:"red"}}/>
        <Link
          to="/"
          style={{
            color: "#fff",
            textDecoration: "none",
            marginLeft: "0px",
            marginTop: "-4px",
            fontSize: "30px",
          }}>
          MyTube
        </Link>
      </div>

      {/* Middle Section - Search bar */}
      <div className="navbar-center">
        <div className="search-bar">
          <input type="text" placeholder="Search" className="search-input" />
          <button className="search-button">
            <SearchIcon />
          </button>
        </div>
      </div>

      <div className="menu">
        {user && (
          <div ref={createRef}>
            <button
              style={{
                backgroundColor: hoverCreate
                  ? "rgba(255, 255, 255, 0.22)"
                  : "rgba(0, 0, 0, 0)",
              }}
              className="create-btn createButton"
              onMouseEnter={() => setHoverCreate(true)}
              onMouseLeave={() => setHoverCreate(false)}
              onClick={() => setCreateMenuOpen(!createMenuOpen)}
            >
              <AddOutlinedIcon style={{ fontSize: "36px", color: "white" }} />
              <span>Create</span>
            </button>

            {createMenuOpen && (
              <ul
                style={{
                  position: "absolute",
                  top: "40px",
                  right: 0,
                  background: "#555",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                  zIndex: 10,
                  listStyle: "none",
                  padding: "5px 0",
                  margin: 0,
                  minWidth: "150px",
                }}
              >
                <li
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                  }}
                  onClick={() => {
                    setCreateMenuOpen(false);
                    navigate("/upload");
                  }}
                >
                  Upload Video
                </li>
              </ul>
            )}
          </div>
        )}

        <NotificationsNoneIcon className="bell-icon" />

        {user ? (
          <div style={{ position: "relative" }} ref={menuRef}>
            <img
              src={user.avatar}
              alt="avatar"
              className="avatar"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <ul
                style={{
                  position: "absolute",
                  top: "40px",
                  right: 0,
                  background: "#555",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                  zIndex: 10,
                  listStyle: "none",
                  padding: "5px 0",
                  margin: 0,
                  minWidth: "150px",
                }}
              >
                <li
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                  }}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </li>
                <li
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                  }}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/settings");
                  }}
                >
                  Settings
                </li>
                <li
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    borderTop: "1px solid #eee",
                  }}
                  onClick={onLogout}
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">
              <button className="button">Login</button>
            </Link>
            <Link to="/register">
              <button className="button">Register</button>
            </Link>
          </>
        )}
      </div>
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <nav className="nav">
          <div style={{ display: "flex", alignItems: "center" }}>
            <button className="hamburger" onClick={toggleSidebar}>
              <YouTubeIcon style={{ fontSize: "33px", marginTop:"-1.8rem"}} />
            </button>

            <p
              style={{
                color: "#fff",
                textDecoration: "none",
                marginLeft: "0px",
                marginTop: "-1px",
                backgroundColor:"",
                fontSize: "30px",
              }}
            >
              MyTube
            </p>
          </div>
        </nav>
        <ul className="hover">
          <li>
            <HomeIcon />
            <Link to="/" >
              Home
            </Link>
          </li>
          <li>
            <SmartDisplayOutlinedIcon />
            <a href="/dashboard"> Your videos</a>
          </li>
          <li>
            <SiYoutubeshorts /> Shorts
          </li>
          <li>
            {" "}
            <SubscriptionsIcon />
            Subscriptions
          </li>
          <li>
            {" "}
            <LibraryAddIcon />
            Library
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </nav>
  );
}
