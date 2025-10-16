// backend/routes/productDetails.js
const express = require("express");
const router = express.Router();
const ProductDetail = require("../models/ProductDetail");

// گرفتن همه جزئیات محصولات
router.get("/", async (req, res) => {
  try {
    const details = await ProductDetail.find().populate("productId");
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// گرفتن جزئیات یک محصول با productId
router.get("/:productId", async (req, res) => {
  try {
    const detail = await ProductDetail.findOne({
      productId: req.params.productId,
    }).populate("productId");
    if (!detail)
      return res.status(404).json({ error: "Product detail not found" });
    res.json(detail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// افزودن جزئیات جدید
router.post("/", async (req, res) => {
  try {
    const {
      productId,
      description,
      features,
      colors,
      sizes,
      images,
      material,
    } = req.body;
    const detail = new ProductDetail({
      productId,
      description,
      features,
      colors,
      sizes,
      images,
      material,
    });
    await detail.save();
    res.status(201).json(detail);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ویرایش جزئیات
router.put("/:productId", async (req, res) => {
  try {
    const { description, features, colors, sizes, images, material } = req.body;
    const detail = await ProductDetail.findOneAndUpdate(
      { productId: req.params.productId },
      { description, features, colors, sizes, images, material },
      { new: true, runValidators: true }
    );
    if (!detail)
      return res.status(404).json({ error: "Product detail not found" });
    res.json(detail);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// حذف جزئیات
router.delete("/:productId", async (req, res) => {
  try {
    const detail = await ProductDetail.findOneAndDelete({
      productId: req.params.productId,
    });
    if (!detail)
      return res.status(404).json({ error: "Product detail not found" });
    res.json({ message: "Product detail deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
