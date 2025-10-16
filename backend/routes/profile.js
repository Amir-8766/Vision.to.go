// backend/routes/profile.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");

// گرفتن پروفایل کاربر لاگین‌شده
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ویرایش پروفایل کاربر لاگین‌شده
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { username, first_name, last_name, phone, address } = req.body;
    
    // Validate required fields
    if (!username || username.trim() === "") {
      return res.status(400).json({ error: "Username is required" });
    }
    
    // Check if username is already taken by another user
    const existingUser = await User.findOne({ 
      username: username.trim(), 
      _id: { $ne: req.user.userId } 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        username: username.trim(), 
        first_name: first_name || "", 
        last_name: last_name || "", 
        phone: phone || "", 
        address: address || "" 
      },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) return res.status(404).json({ error: "User not found" });
    
    console.log("Updated user:", user); // Debug log
    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err); // Debug log
    
    // Handle specific MongoDB errors
    if (err.code === 11000) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// حذف حساب کاربری
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
