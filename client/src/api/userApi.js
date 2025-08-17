import axiosInstance from "./axiosInstance";

// ==================== AUTH ====================

// Register user (with avatar + cover image upload)
export const registerUser = (formData) =>
  axiosInstance.post(
    "/users/register",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
    { withCredentials: true }
  );

// Login
export const loginUser = (data) =>
  axiosInstance.post("/users/login", data, { withCredentials: true });

// Get current user
export const getCurrentUser = () => {
  return axiosInstance.get("/users/me", { withCredentials: true });
};

// Logout
export const logoutUser = () =>
  axiosInstance.post("/users/logout", {}, { withCredentials: true });

// Refresh token
export const refreshAccessToken = () =>
  axiosInstance.post("/users/refresh-token");

// ==================== USER ACCOUNT ====================

// Change password
export const changePassword = (data) =>
  axiosInstance.post("/users/change-password", data);

// Update account details (name, email, etc.)
export const updateAccountDetails = (data) =>
  axiosInstance.post("/users/update-account", data);

// Update avatar
export const updateAvatar = (formData) =>
  axiosInstance.patch("/users/update-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Update cover image
export const updateCoverImage = (formData) =>
  axiosInstance.patch("/users/update-coverImage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ==================== USER PROFILE ====================

// Get user channel profile by username
export const getUserChannelProfile = (username) =>
  axiosInstance.get(`/users/C/${username}`);

// Get watch history
export const getWatchHistory = () => axiosInstance.get("/users/watch-history");
