// backend/models/ProductDetail.js
const mongoose = require("mongoose");

const productDetailSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true,
  },
  description: String,
  features: [String], // آرایه‌ای از ویژگی‌ها
  colors: [String], // رنگ‌های موجود
  sizes: [String], // سایزهای موجود
  images: [String], // آدرس تصاویر اضافی
  material: String, // جنس پارچه یا ...
});

module.exports = mongoose.model("ProductDetail", productDetailSchema);
