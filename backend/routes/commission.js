// backend/routes/commission.js
const express = require("express");
const router = express.Router();
const CommissionProduct = require("../models/CommissionProduct");
const { authMiddleware } = require("../middleware/auth");

// گرفتن همه کالاهای کمیسیونی فعال
router.get("/", async (req, res) => {
  try {
    const products = await CommissionProduct.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// گرفتن یک کالای کمیسیونی با id
router.get("/:id", async (req, res) => {
  try {
    const product = await CommissionProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// افزودن کالای کمیسیونی جدید (فقط ادمین)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const product = new CommissionProduct(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ویرایش کالای کمیسیونی (فقط ادمین)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const product = await CommissionProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// حذف کالای کمیسیونی (فقط ادمین)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const product = await CommissionProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
