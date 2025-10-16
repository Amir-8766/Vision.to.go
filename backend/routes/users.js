// backend/routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// گرفتن همه کاربران (فقط ادمین)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // پسورد را نده
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// گرفتن یک کاربر با id (فقط ادمین یا خود کاربر)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    // اگر ادمین نیست و خودش نیست، دسترسی نده
    if (req.user.role !== "admin" && req.user.userId !== req.params.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ویرایش کاربر (فقط ادمین یا خود کاربر)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { username, email, first_name, last_name, phone, address, role } =
      req.body;

    // اگر ادمین نیست و خودش نیست، دسترسی نده
    if (req.user.role !== "admin" && req.user.userId !== req.params.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // فقط ادمین می‌تواند نقش را تغییر دهد
    const updateData = {
      username,
      email,
      first_name,
      last_name,
      phone,
      address,
    };
    if (req.user.role === "admin") {
      updateData.role = role;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /users/:userId/role - Change user role (Admin only)
router.put("/:userId/role", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Check if current user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Validate role
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Update user role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// حذف کاربر (فقط ادمین)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
