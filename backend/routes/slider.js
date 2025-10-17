const express = require("express");
const router = express.Router();
const SliderImage = require("../models/SliderImage");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Public: list active slider images ordered
router.get("/", async (req, res) => {
  try {
    const images = await SliderImage.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slider images" });
  }
});

// Admin: create
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { imageUrl, title, alt, order, isActive } = req.body;
    if (!imageUrl) return res.status(400).json({ error: "imageUrl required" });
    const created = await SliderImage.create({
      imageUrl,
      title,
      alt,
      order,
      isActive,
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create slider image" });
  }
});

// Admin: update
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await SliderImage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update slider image" });
  }
});

// Admin: delete
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await SliderImage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete slider image" });
  }
});

module.exports = router;


