const express = require("express");
const router = express.Router();
const FeaturedProduct = require("../models/FeaturedProduct");
const Product = require("../models/Product");
const { authMiddleware } = require("../middleware/auth");

// Get all featured products with product details
router.get("/", async (req, res) => {
  try {
    const featuredProducts = await FeaturedProduct.find({ isActive: true })
      .populate("productId")
      .sort({ displayOrder: 1 });

    res.json(featuredProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all featured products for admin (including inactive)
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const featuredProducts = await FeaturedProduct.find()
      .populate("productId")
      .sort({ displayOrder: 1 });

    res.json(featuredProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a product to featured list
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { productId, displayOrder, customTitle, customDescription } =
      req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if display order is already taken
    const existingFeatured = await FeaturedProduct.findOne({ displayOrder });
    if (existingFeatured) {
      return res.status(400).json({
        error: `Display order ${displayOrder} is already taken`,
      });
    }

    // Check if product is already featured
    const alreadyFeatured = await FeaturedProduct.findOne({
      productId,
      isActive: true,
    });
    if (alreadyFeatured) {
      return res.status(400).json({
        error: "Product is already featured",
      });
    }

    const featuredProduct = new FeaturedProduct({
      productId,
      displayOrder,
      customTitle,
      customDescription,
    });

    await featuredProduct.save();
    await featuredProduct.populate("productId");

    res.status(201).json(featuredProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update featured product
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { displayOrder, customTitle, customDescription, isActive } = req.body;

    // Check if new display order is already taken by another featured product
    if (displayOrder) {
      const existingFeatured = await FeaturedProduct.findOne({
        displayOrder,
        _id: { $ne: req.params.id },
      });
      if (existingFeatured) {
        return res.status(400).json({
          error: `Display order ${displayOrder} is already taken`,
        });
      }
    }

    const featuredProduct = await FeaturedProduct.findByIdAndUpdate(
      req.params.id,
      { displayOrder, customTitle, customDescription, isActive },
      { new: true, runValidators: true }
    ).populate("productId");

    if (!featuredProduct) {
      return res.status(404).json({ error: "Featured product not found" });
    }

    res.json(featuredProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove product from featured list
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const featuredProduct = await FeaturedProduct.findByIdAndDelete(
      req.params.id
    );
    if (!featuredProduct) {
      return res.status(404).json({ error: "Featured product not found" });
    }

    res.json({ message: "Featured product removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get available products for featuring (products not already featured)
router.get("/available-products", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get all products
    const allProducts = await Product.find({ active: true });

    // Get already featured product IDs
    const featuredProductIds = await FeaturedProduct.find({
      isActive: true,
    }).distinct("productId");

    // Filter out already featured products
    const availableProducts = allProducts.filter(
      (product) => !featuredProductIds.includes(product._id.toString())
    );

    res.json(availableProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
