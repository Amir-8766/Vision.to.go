// backend/models/CommissionProduct.js
const mongoose = require("mongoose");

const commissionProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, // قیمت اصلی قبل از تخفیف
  isDiscounted: { type: Boolean, default: false }, // آیا محصول تخفیف خورده
  discountLabel: { type: String, default: "Last Chance" }, // برچسب تخفیف
  commissionRate: { type: Number, required: true, min: 0, max: 100 }, // 30-40%
  partnerName: { type: String, required: true },
  partnerLogo: String,
  partnerDescription: String,
  category: String,
  images: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommissionProduct", commissionProductSchema);
