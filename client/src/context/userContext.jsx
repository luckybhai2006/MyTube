import { createContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser } from "../api/userApi";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");


  // Only fetch user on mount if not already set
  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const res = await getCurrentUser();
          setUser(res.data);
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      await loginUser(credentials); // Backend sets cookies
      const res = await getCurrentUser(); // Get fresh user
      setUser(res.data);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, handleLogin, handleLogout,activeCategory,
        setActiveCategory}}
    >
      {children}
    </UserContext.Provider>
  );
};