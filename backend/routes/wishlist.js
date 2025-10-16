// backend/routes/wishlist.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const { authMiddleware } = require("../middleware/auth");

// لیست محصولات wishlist کاربر
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("wishlist");
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// افزودن محصول به wishlist
router.post("/:productId", authMiddleware, async (req, res) => {
  console.log("POST /wishlist/:productId", req.params.productId, req.user);
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.userId);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// حذف محصول از wishlist
router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.userId);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
