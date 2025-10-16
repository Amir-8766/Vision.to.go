import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import loginBg from "../assets/login-background.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        login(data.token);
        if (stayLoggedIn) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }
        alert("Welcome back! ✅");
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    if (provider === "Google") {
      await handleGoogleLogin();
    } else {
      console.log(`${provider} login will be implemented soon!`);
      alert(`${provider} login will be implemented soon!`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const GOOGLE_CLIENT_ID =
        "302616575801-l6933ks6nbc8oom4md7jm6p0mbomsv6b.apps.googleusercontent.com";
      const REDIRECT_URI = `${window.location.origin}/auth-success`;

      const googleAuthUrl =
        `https://accounts.google.com/oauth/authorize?` +
        `client_id=${GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=email profile` +
        `&response_type=code` +
        `&access_type=offline`;

      // Open Google OAuth popup
      const popup = window.open(
        googleAuthUrl,
        "googleAuth",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      );

      // Remove the problematic interval check
      // const checkClosed = setInterval(() => {
      //   if (popup.closed) {
      //     clearInterval(checkClosed);
      //     console.log("Google OAuth popup closed");
      //   }
      // }, 1000);
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-20 px-4"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-md w-full">
        <div className="backdrop-blur-md bg-white/20 rounded-2xl shadow-2xl border border-white/30 p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-white drop-shadow-lg">
            Login
          </h2>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 backdrop-blur-sm text-red-100 rounded-lg border border-red-300/30">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-white drop-shadow-sm">
                Email
              </label>
              <input
                className="w-full border border-white/60 bg-white/85 backdrop-blur-sm text-gray-900 placeholder-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all md:bg-white md:backdrop-blur-0 md:border-white/80"
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  WebkitTextFillColor: "#111827",
                  caretColor: "#111827",
                }}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-white drop-shadow-sm">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full border border-white/60 bg-white/85 backdrop-blur-sm text-gray-900 placeholder-gray-700 p-3 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all md:bg-white md:backdrop-blur-0 md:border-white/80"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#111827",
                    WebkitTextFillColor: "#111827",
                    caretColor: "#111827",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors z-10"
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, #ffffff 40%)",
                    paddingLeft: "8px",
                  }}
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                >
                  {!showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 accent-gray-800 bg-white border border-white/80 rounded"
                  style={{ backgroundColor: "#ffffff" }}
                  checked={stayLoggedIn}
                  onChange={(e) => setStayLoggedIn(e.target.checked)}
                />
                <span className="text-sm text-white/90 drop-shadow-sm">
                  Stay logged in
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                loading
                  ? "bg-white/30 cursor-not-allowed text-white/50"
                  : "bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm"
              }`}
            >
              {loading ? "Login in progress..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              <span className="text-white/80">Don't have an account? </span>
              <Link
                to="/register"
                className="text-white hover:text-white/80 underline transition-colors"
              >
                Sign up
              </Link>
            </div>
            <div>
              <Link
                to="/forget-password"
                className="text-white/70 hover:text-white underline transition-colors text-xs"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Social Login Section */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-transparent text-white/70">Or</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {/* Facebook Login */}
              <button
                onClick={() => handleSocialLogin("Facebook")}
                className="w-full flex items-center justify-center px-4 py-3 border border-white/30 rounded-lg shadow-sm text-white bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Login with Facebook
              </button>

              {/* Google Login */}
              <button
                onClick={() => handleSocialLogin("Google")}
                className="w-full flex items-center justify-center px-4 py-3 border border-white/30 rounded-lg shadow-sm bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Login with Google
              </button>

              {/* Apple Login */}
              <button
                onClick={() => handleSocialLogin("Apple")}
                className="w-full flex items-center justify-center px-4 py-3 border border-white/30 rounded-lg shadow-sm bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Login with Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
