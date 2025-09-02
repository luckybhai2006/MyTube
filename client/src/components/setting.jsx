import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import axiosInstance from "../api/axiosInstance";
import "../styles/setting.css";

const SettingsPage = () => {
  const { user, setUser } = useContext(UserContext);

  // Profile state
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Avatar & Cover
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (!user)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );

  // ---------- Profile Update ----------
  const handleUpdateProfile = async () => {
    try {
      const res = await axiosInstance.post("/users/update-account", {
        fullname,
        email,
      });
      setUser(res.data.data);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  // ---------- Change Password ----------
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match");
      return;
    }
    try {
      const res = await axiosInstance.post("/users/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Password change failed");
    }
  };

  // ---------- Upload Avatar ----------
  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      const res = await axiosInstance.patch("/users/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data.data);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Avatar upload failed");
    }
  };

  // ---------- Upload Cover ----------
  const handleUploadCover = async () => {
    if (!coverFile) return;
    const formData = new FormData();
    formData.append("coverImage", coverFile);
    try {
      const res = await axiosInstance.patch(
        "/users/update-coverImage",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser(res.data.data);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Cover upload failed");
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      {message && <p className="settings-message">{message}</p>}

      {/* ---------- Update Profile ---------- */}
      <section className="settings-section">
        <h2 className="section-title">Profile Info</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="settings-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="settings-input"
        />
        <button onClick={handleUpdateProfile} className="settings-btn">
          Update Profile
        </button>
      </section>

      {/* ---------- Change Password ---------- */}
      <section className="settings-section">
        <h2 className="section-title">Change Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="settings-input"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="settings-input"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="settings-input"
        />
        <button onClick={handleChangePassword} className="settings-btn">
          Change Password
        </button>
      </section>

      {/* ---------- Upload Avatar ---------- */}
      <section className="settings-section">
        <h2 className="section-title">Update Avatar</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files[0])}
          className="settings-input-file"
        />
        <button onClick={handleUploadAvatar} className="settings-btn">
          Upload Avatar
        </button>
      </section>

      {/* ---------- Upload Cover Image ---------- */}
      <section className="settings-section">
        <h2 className="section-title">Update Cover Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files[0])}
          className="settings-input-file"
        />
        <button onClick={handleUploadCover} className="settings-btn">
          Upload Cover
        </button>
      </section>
    </div>
  );
};

export default SettingsPage;
