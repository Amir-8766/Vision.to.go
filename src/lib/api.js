// src/lib/api.js
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:10000";

export { BASE_URL };

// تابع برای گرفتن URL عکس
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  // اگر URL کامل هست (شروع با http یا https)
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // اگر مسیر محلی هست (شروع با /uploads/)
  if (imagePath.startsWith("/uploads/")) {
    return BASE_URL + imagePath;
  }

  // در غیر این صورت، فرض می‌کنیم که URL کامل هست
  return imagePath;
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  // Get token from localStorage
  const token = localStorage.getItem("token");

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

// Environment info for debugging
export const getEnvironmentInfo = () => {
  return {
    baseUrl: BASE_URL,
    environment: import.meta.env.VITE_APP_ENVIRONMENT || "development",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
    appName: import.meta.env.VITE_APP_NAME || "VisionToGo",
  };
};
