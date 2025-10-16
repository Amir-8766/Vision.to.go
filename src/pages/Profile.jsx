import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import OrderHistory from "../components/OrderHistory";

export default function Profile() {
  const { user, loading: authLoading, logout, updateUser } = useAuth();
  const { clearCart } = useCart();
  const { clearWishlist } = useWishlist();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const navigate = useNavigate();

  const loadProfile = async () => {
    try {
      setError("");
      setSuccess("");
      setUsernameError("");
      const res = await apiFetch("/profile");
      if (!res.ok) {
        if (res.status === 401) {
          // Token expired or invalid
          logout();
          navigate("/login");
          return;
        }
        throw new Error(`HTTP ${res.status}: Failed to load profile`);
      }
      const data = await res.json();
      console.log("Loaded profile data:", data); // Debug log
      setProfile(data);
    } catch (err) {
      console.error("Profile loading error:", err);
      setError("Failed to load profile: " + err.message);
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      navigate("/login");
      return;
    }
    loadProfile();
  }, [user, authLoading, logout, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    // Clear username error when user starts typing
    if (name === "username") {
      setUsernameError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    setUsernameError("");

    try {
      console.log("Submitting profile data:", profile); // Debug log

      const res = await apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          navigate("/login");
          return;
        }

        const errorData = await res.json();
        if (res.status === 400 && errorData.error.includes("Username")) {
          setUsernameError(errorData.error);
          return;
        }

        throw new Error(
          `HTTP ${res.status}: ${errorData.error || "Failed to update profile"}`
        );
      }

      const data = await res.json();
      console.log("Updated profile response:", data); // Debug log

      // Update profile state with the response data
      setProfile(data);

      // Update AuthContext with new username
      updateUser({
        username: data.username,
        email: data.email,
      });

      setSuccess("✅ Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile: " + err.message);
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        logout();
        navigate("/login");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      const res = await apiFetch("/profile", {
        method: "DELETE",
      });
      if (!res.ok) {
        if (res.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        throw new Error(`HTTP ${res.status}: Failed to delete account`);
      }
      alert("Account deleted successfully");
      logout();
      clearCart();
      clearWishlist();
      navigate("/");
    } catch (err) {
      console.error("Account deletion error:", err);
      setError("Failed to delete account: " + err.message);
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    logout();
    clearCart();
    clearWishlist();
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-[#171717]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please log in
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-white/90">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mx-6 mt-4 rounded">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "orders"
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Order History
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={profile.username || ""}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        usernameError ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your username"
                      required
                      style={{ backgroundColor: "#ffffff", color: "#111827" }}
                    />
                    {usernameError && (
                      <p className="text-red-500 text-sm mt-1">
                        {usernameError}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Choose a unique username that others can use to find you
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={profile.first_name || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      style={{ backgroundColor: "#ffffff", color: "#111827" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={profile.last_name || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      style={{ backgroundColor: "#ffffff", color: "#111827" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      style={{ backgroundColor: "#ffffff", color: "#111827" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={profile.address || ""}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      style={{ backgroundColor: "#ffffff", color: "#111827" }}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600"
                  >
                    Logout
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">
                    Danger Zone
                  </h3>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600"
                  >
                    Delete Account
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    This action cannot be undone. All your data will be
                    permanently deleted.
                  </p>
                </div>
              </form>
            )}

            {activeTab === "orders" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Order History
                </h3>
                <OrderHistory />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
