// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // اطلاعات کاربر را به req اضافه می‌کنیم
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

const authMiddlewareOptional = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // اگر توکن نامعتبر بود، کاربر را ست نکن
      req.user = null;
    }
  }
  next();
};

function adminMiddleware(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied: Admins only" });
  }
}

// اینجا باید هر سه میدل‌ویر را export کنی
module.exports = {
  authMiddleware,
  authMiddlewareOptional,
  adminMiddleware, // ← این خط را اضافه کن
};
