import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function LoginBackend() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("ورود موفق!");
      // ریدایرکت یا هر کار دیگری
    } else {
      setError(data.error || "خطا در ورود");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button type="submit">Login (Backend)</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
