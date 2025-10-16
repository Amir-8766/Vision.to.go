// backend/routes/inventory.js
const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// گرفتن همه موجودی‌ها (فقط ادمین)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("productId");
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// افزودن موجودی جدید (فقط ادمین)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { productId, color, size, quantity } = req.body;
    const inv = new Inventory({ productId, color, size, quantity });
    await inv.save();
    res.status(201).json(inv);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ویرایش موجودی (فقط ادمین)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { productId, color, size, quantity } = req.body;
    const inv = await Inventory.findByIdAndUpdate(
      req.params.id,
      { productId, color, size, quantity },
      { new: true, runValidators: true }
    );
    if (!inv) return res.status(404).json({ error: "Inventory not found" });
    res.json(inv);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// کاهش موجودی محصول بعد از خرید
router.post("/:productId/decrease", authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const inventory = await Inventory.findOne({ productId: req.params.productId });
    
    if (!inventory) {
      return res.status(404).json({ error: "Product inventory not found" });
    }
    
    if (inventory.quantity < quantity) {
      return res.status(400).json({ error: "Insufficient inventory" });
    }
    
    inventory.quantity -= quantity;
    await inventory.save();
    
    res.json({ message: "Inventory updated successfully", inventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// حذف موجودی (فقط ادمین)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const inv = await Inventory.findByIdAndDelete(req.params.id);
    if (!inv) return res.status(404).json({ error: "Inventory not found" });
    res.json({ message: "Inventory deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
