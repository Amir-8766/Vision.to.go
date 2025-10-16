import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import loginBg from "../assets/login-background.jpg";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await apiFetch("/auth/forget-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset email");
      } else {
        setMessage("Password reset email sent successfully! Check your inbox.");
        setEmail("");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
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
            Forget Password
          </h2>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 backdrop-blur-sm text-red-100 rounded-lg border border-red-300/30">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-3 bg-green-500/20 backdrop-blur-sm text-green-100 rounded-lg border border-green-300/30">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-white drop-shadow-sm">
                Email Address
              </label>
              <input
                className="w-full border border-white/60 bg-white/85 backdrop-blur-sm text-gray-900 placeholder-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-white/80">Remember your password? </span>
            <Link
              to="/login"
              className="text-white hover:text-white/80 underline transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
