import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // فرض: توکن بازیابی رمز عبور از طریق URL ارسال می‌شود (مثلاً ?token=...)
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }
    setLoading(true);
    try {
      const token = getTokenFromUrl();
      if (!token)
        throw new Error(
          "Kein Token gefunden. Bitte öffnen Sie den Link aus Ihrer E-Mail."
        );
      const res = await apiFetch("/auth/update-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error || "Fehler beim Aktualisieren des Passworts"
        );
      }
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.message || "Fehler beim Aktualisieren des Passworts");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Erfolg!</h2>
        <p>Ihr Passwort wurde erfolgreich aktualisiert.</p>
        <p>Sie werden zur Login-Seite weitergeleitet...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Passwort zurücksetzen
      </h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Neues Passwort
          </label>
          <input
            className="w-full border p-2 rounded"
            type="password"
            placeholder="Neues Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">
            Passwort bestätigen
          </label>
          <input
            className="w-full border p-2 rounded"
            type="password"
            placeholder="Passwort wiederholen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Wird verarbeitet..." : "Passwort aktualisieren"}
        </button>
      </form>
    </div>
  );
}
