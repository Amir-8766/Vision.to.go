import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import loginBg from "../assets/login-background.jpg";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Function to generate username from first_name and last_name
  const generateUsername = (firstName, lastName) => {
    if (!firstName || !lastName) return "";

    // Remove special characters and spaces, convert to lowercase
    const cleanFirstName = firstName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const cleanLastName = lastName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    // Generate username: firstname.lastname
    return `${cleanFirstName}.${cleanLastName}`;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!form.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});

    try {
      // Generate username from first_name and last_name
      const generatedUsername = generateUsername(
        form.first_name,
        form.last_name
      );

      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: generatedUsername,
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          address: form.address,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ general: data.error || "Registration failed" });
      } else {
        alert("✅ Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    // TODO: Implement social registration logic
    console.log(`Registering with ${provider}`);
    alert(`${provider} registration will be implemented soon!`);
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
          <h2 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg">
            Registrieren
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-500/20 backdrop-blur-sm text-red-100 rounded-lg border border-red-300/30">
                {errors.general}
              </div>
            )}

            <div>
              <input
                type="email"
                name="email"
                placeholder="E-Mail"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border border-white/60 bg-white/85 backdrop-blur-sm text-gray-900 placeholder-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  WebkitTextFillColor: "#111827",
                  caretColor: "#111827",
                }}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Passwort"
                required
                value={form.password}
                onChange={handleChange}
                className={`w-full border border-white/60 bg-white/85 backdrop-blur-sm text-gray-900 placeholder-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all ${
                  errors.password ? "border-red-400" : ""
                }`}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  WebkitTextFillColor: "#111827",
                  caretColor: "#111827",
                }}
              />
              {errors.password && (
                <p className="text-red-200 text-xs mt-1 drop-shadow-sm">
                  {errors.password}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Passwort bestätigen"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full border border-white/60 bg-white/85 backdrop-blur-sm text-gray-900 placeholder-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all ${
                  errors.confirmPassword ? "border-red-400" : ""
                }`}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  WebkitTextFillColor: "#111827",
                  caretColor: "#111827",
                }}
              />
              {errors.confirmPassword && (
                <p className="text-red-200 text-xs mt-1 drop-shadow-sm">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <div>
              <input
                name="first_name"
                placeholder="Vorname"
                required
                value={form.first_name}
                onChange={handleChange}
                className={`w-full border border-white/60 bg-white/85 backdrop-blur-sm text-gray-900 placeholder-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all ${
                  errors.first_name ? "border-red-400" : ""
                }`}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  WebkitTextFillColor: "#111827",
                  caretColor: "#111827",
                }}
              />
              {errors.first_name && (
                <p className="text-red-200 text-xs mt-1 drop-shadow-sm">
                  {errors.first_name}
                </p>
              )}
            </div>
            <div>
              <input
                name="last_name"
                placeholder="Nachname"
                required
                value={form.last_name}
                onChange={handleChange}
                className={`w-full border border-white/60 bg-white/85 backdrop-blur-sm text-gray-900 placeholder-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all ${
                  errors.last_name ? "border-red-400" : ""
                }`}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  WebkitTextFillColor: "#111827",
                  caretColor: "#111827",
                }}
              />
              {errors.last_name && (
                <p className="text-red-200 text-xs mt-1 drop-shadow-sm">
                  {errors.last_name}
                </p>
              )}
            </div>
            <div>
              <input
                name="phone"
                placeholder="Telefonnummer"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-white/60 bg-white/85 backdrop-blur-sm text-gray-900 placeholder-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  WebkitTextFillColor: "#111827",
                  caretColor: "#111827",
                }}
              />
            </div>
            <div>
              <input
                name="address"
                placeholder="Adresse"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-white/60 bg-white/85 backdrop-blur-sm text-gray-900 placeholder-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  WebkitTextFillColor: "#111827",
                  caretColor: "#111827",
                }}
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
              {loading ? "Registrierung läuft..." : "Registrieren"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-white/80">Already have an account? </span>
            <Link
              to="/login"
              className="text-white hover:text-white/80 underline transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Social Login Section */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-transparent text-white/70">Oder</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {/* Facebook Registration */}
              <button
                onClick={() => handleSocialRegister("Facebook")}
                className="w-full flex items-center justify-center px-4 py-3 border border-white/30 rounded-lg shadow-sm text-white bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Mit Facebook registrieren
              </button>

              {/* Google Registration */}
              <button
                onClick={() => handleSocialRegister("Google")}
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
                Mit Google registrieren
              </button>

              {/* Apple Registration */}
              <button
                onClick={() => handleSocialRegister("Apple")}
                className="w-full flex items-center justify-center px-4 py-3 border border-white/30 rounded-lg shadow-sm bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Mit Apple registrieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
