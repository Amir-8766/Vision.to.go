// backend/routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// گرفتن همه سفارش‌ها (فقط ادمین)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// گرفتن سفارشات کاربر فعلی
router.get("/user/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// گرفتن یک سفارش با id (فقط ادمین یا صاحب سفارش)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId"
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    // اگر ادمین نیست و صاحب سفارش نیست، دسترسی نده
    if (req.user.role !== "admin" && order.userId !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ثبت سفارش جدید (فقط کاربر لاگین‌شده)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      userId,
      items,
      totalPrice,
      status,
      shippingAddress,
      paymentIntentId,
    } = req.body;
    const order = new Order({
      userId,
      items,
      totalPrice,
      status,
      shippingAddress,
      paymentIntentId,
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ویرایش سفارش (فقط ادمین)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      userId,
      items,
      totalPrice,
      status,
      shippingAddress,
      paymentIntentId,
    } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { userId, items, totalPrice, status, shippingAddress, paymentIntentId },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// حذف سفارش (فقط ادمین)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
