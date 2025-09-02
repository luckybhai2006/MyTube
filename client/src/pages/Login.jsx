import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import "../styles/logester.css"; // keep CSS file updated too

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { handleLogin } = useContext(UserContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => setAvatar(e.target.files[0]);
  const handleCoverChange = (e) => setCoverImage(e.target.files[0]);

  // login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin({
      email: formData.email,
      password: formData.password,
    });
    if (success) {
      setError("");
      navigate("/");
    } else {
      setError("Invalid credentials");
    }
  };

  // register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!avatar) {
      setError("Avatar is required");
      return;
    }

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("fullname", formData.fullname);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("avatar", avatar);
      if (coverImage) data.append("coverImage", coverImage);

      await axios.post(`${API_URL}/api/v1/users/register`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Registration successful!");
      setFormData({ username: "", fullname: "", email: "", password: "" });
      setAvatar(null);
      setCoverImage(null);
      setIsLogin(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-body-xyz">
      <div className="main-xyz">
        <input
          type="checkbox"
          id="chk"
          checked={!isLogin}
          onChange={() => setIsLogin(!isLogin)}
        />

        {/* Signup */}
        <div className="signup-xyz">
          <form onSubmit={handleRegisterSubmit} encType="multipart/form-data">
            <label htmlFor="chk">Sign Up</label>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <div className="frm-xyz">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="file"
                name="avatar"
                placeholder="choose your profile avatar"
                onChange={handleAvatarChange}
              />
              <input
                type="file"
                name="coverImage"
                onChange={handleCoverChange}
              />
            </div>
            <button type="submit" className="btns">
              Sign Up
            </button>
          </form>
        </div>

        {/* Login */}
        <div className="login-xyz">
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="chk">Login</label>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {/* <div style={{ marginTop: "120px" }}> */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btns">
              Login
            </button>
            {/* </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
