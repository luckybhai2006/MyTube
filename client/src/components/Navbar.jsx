import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import "../styles/app.css";
import "../styles/leftDashboard.css";

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 12px",
    backgroundColor: "#121212",
    color: "#fff",
    // borderRadius: "10px",
    alignItems: "center",
  },
  menu: { display: "flex", gap: "10px", alignItems: "center" },
  button: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#ff4500",
    color: "#fff",
  },
  createButton: {
    padding: "6px 16px",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    backgroundColor: "#ff0000",
    color: "#fff",
    // fontWeight: "bold",
    fontSize: "1rem",
    height: "35px",
    transition: "background-color 0.2s ease",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "15px",
  },
};

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
    <nav style={styles.nav}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button className="hamburger" onClick={toggleSidebar}>
          <MenuIcon style={{ fontSize: "32px" }} />
        </button>
        <Link
          to="/"
          style={{
            color: "#fff",
            textDecoration: "none",
            marginLeft: "0px",
            marginTop: "-4px",
            fontSize: "30px",
          }}
        >
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

      <div style={styles.menu}>
        {user && (
          <div ref={createRef}>
            <button
              style={{
                ...styles.createButton,
                backgroundColor: hoverCreate
                  ? "rgba(255, 255, 255, 0.22)"
                  : "rgba(0, 0, 0, 0)",
              }}
              className="create-btn"
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
              style={styles.avatar}
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
              <button style={styles.button}>Login</button>
            </Link>
            <Link to="/register">
              <button style={styles.button}>Register</button>
            </Link>
          </>
        )}
      </div>
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <nav style={styles.nav}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button className="hamburger" onClick={toggleSidebar}>
              <MenuIcon style={{ fontSize: "32px" }} />
            </button>
            <Link
              to="/"
              style={{
                color: "#fff",
                textDecoration: "none",
                marginLeft: "0px",
                marginTop: "-4px",
                fontSize: "30px",
              }}
            >
              MyTube
            </Link>
          </div>
        </nav>
        <ul>
          <li>
            <HomeIcon />
            <Link
              to="/"
              style={{
                color: "#fff",
                textDecoration: "none",
                marginLeft: "0px",
                marginTop: "-4px",
                fontSize: "20px",
              }}
            >
              Home
            </Link>
          </li>
          <li>
            {" "}
            <Link
              to="/dashboard"
              style={{
                color: "#fff",
                textDecoration: "none",
                marginLeft: "0px",
                marginTop: "-4px",
                fontSize: "20px",
              }}
            >
              Your videos
            </Link>
          </li>
          <li>Shorts</li>
          <li>Subscriptions</li>
          <li>Library</li>
        </ul>
      </div>

      {/* Overlay */}
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </nav>
  );
}
