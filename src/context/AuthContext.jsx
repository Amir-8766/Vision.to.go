import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user: { userId, email, role, username }
  const [loading, setLoading] = useState(true);

  // توکن را از localStorage بخوان و decode کن
  const loadUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          userId: decoded.userId,
          email: decoded.email,
          username: decoded.username,
          role: decoded.role,
        });
      } catch (err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  // Update user data (for profile updates)
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  // login: توکن را ذخیره کن و user را ست کن
  const login = (token) => {
    localStorage.setItem("token", token);
    loadUserFromToken();
  };

  // logout: توکن را حذف کن ولی Cart/Wishlist را نگه دار
  const logout = () => {
    localStorage.removeItem("token");

    // Cart و Wishlist کاربر فعلی را نگه می‌داریم
    // تا بعد از login مجدد در دسترس باشند

    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser, // Add this method
    // Add role for backward compatibility
    role: user?.role,
    username: user?.username,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
