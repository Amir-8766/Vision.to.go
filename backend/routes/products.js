const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const {
  authMiddleware,
  authMiddlewareOptional,
} = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// تنظیمات Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// تنظیمات ذخیره فایل روی Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mir-femme/products",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "avif"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});
const upload = multer({ storage });

// روت آپلود عکس (فقط ادمین) ← باید قبل از روت‌های پارامتری باشد!
router.post("/upload", authMiddleware, upload.single("image"), (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Access denied" });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ imageUrl: req.file.path });
});

// گرفتن همه محصولات
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// افزودن محصول جدید (فقط ادمین)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      isDiscounted,
      discountLabel,
      description,
      zustand,
      width,
      depth,
      height,
      brand,
      model,
      color,
      material,
      pattern,
      image,
      images,
    } = req.body;
    const product = new Product({
      name,
      price,
      originalPrice,
      isDiscounted,
      discountLabel,
      description,
      zustand,
      width,
      depth,
      height,
      brand,
      model,
      color,
      material,
      pattern,
      image,
      images,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// گرفتن یک محصول با id
// فرض: authMiddlewareOptional می‌تواند کاربر لاگین یا مهمان باشد
router.get("/:id", authMiddlewareOptional, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });

    // محاسبه میانگین امتیاز
    product.avgRating =
      product.ratings && product.ratings.length
        ? (
            product.ratings.reduce((sum, r) => sum + r.rating, 0) /
            product.ratings.length
          ).toFixed(1)
        : null;

    let userRating = 0,
      hasBought = false;
    if (req.user) {
      const userId = req.user.userId;
      const ratingObj = product.ratings?.find(
        (r) => r.user.toString() === userId
      );
      userRating = ratingObj ? ratingObj.rating : 0;
      // بررسی خرید محصول
      hasBought = await Order.exists({
        userId: userId,
        "items.productId": product._id,
        status: "پرداخت شده", // مقدار دقیق status در دیتابیس
      });
    }
    res.json({
      ...product,
      avgRating: product.avgRating,
      userRating,
      hasBought,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ویرایش محصول (فقط ادمین)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Access denied" });
    const {
      name,
      price,
      originalPrice,
      isDiscounted,
      discountLabel,
      description,
      zustand,
      width,
      depth,
      height,
      brand,
      model,
      color,
      material,
      pattern,
      image,
      images,
    } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        originalPrice,
        isDiscounted,
        discountLabel,
        description,
        zustand,
        width,
        depth,
        height,
        brand,
        model,
        color,
        material,
        pattern,
        image,
        images,
      },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// حذف محصول (فقط ادمین)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Access denied" });
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// فرض: مدل Order دارید که سفارشات را نگه می‌دارد
const Order = require("../models/Order");

router.post("/:id/rate", authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user.userId;
  const productId = req.params.id;

  // بررسی اینکه کاربر این محصول را خریده
  const hasBought = await Order.exists({
    userId: userId,
    "items.productId": productId,
    status: "پرداخت شده", // مقدار دقیق status در دیتابیس
  });
  if (!hasBought)
    return res
      .status(403)
      .json({ error: "You have not purchased this product" });

  // پیدا کردن محصول
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  // اگر قبلاً امتیاز داده، ویرایش کن
  const existing = product.ratings?.find((r) => r.user.toString() === userId);
  if (existing) {
    existing.rating = rating;
    existing.comment = comment;
  } else {
    product.ratings.push({ user: userId, rating, comment });
  }
  await product.save();
  res.json({ message: "Rating submitted" });
});

module.exports = router;
