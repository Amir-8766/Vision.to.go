import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccessDenied from "./AccessDenied";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Decode JWT token to get user role
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.role;

        if (requireAdmin && role !== "admin") {
          console.log("User is not admin, showing access denied");
          setShowAccessDenied(true);
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        navigate("/login");
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, requireAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (showAccessDenied) {
    return <AccessDenied />;
  }

  return isAuthorized ? children : null;
};

export default ProtectedRoute;
