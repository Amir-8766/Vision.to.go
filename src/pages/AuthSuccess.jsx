import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      alert(`Authentication failed: ${error}`);
      navigate("/login");
      return;
    }

    if (token) {
      // Store token and redirect
      login(token);
      alert("✅ Google login successful!");
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-[#171717]">Completing authentication...</p>
      </div>
    </div>
  );
}
