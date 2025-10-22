// backend/models/CommissionProduct.js
const mongoose = require("mongoose");

const commissionProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, // قیمت اصلی قبل از تخفیف
  isDiscounted: { type: Boolean, default: false }, // آیا محصول تخفیف خورده
  discountLabel: { type: String, default: "Last Chance" }, // برچسب تخفیف
  airlineLogo: String, // لوگو هواپیمایی
  images: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  // Flight specific fields
  airline: String,
  flightCode: String,
  flightClass: { type: String, default: "Economy" },
  departureCode: String,
  departureCity: String,
  departureTime: String,
  arrivalCode: String,
  arrivalCity: String,
  arrivalTime: String,
  duration: String,
  durationHours: String,
  durationMinutes: String,
  flightImageUrl: String,
});

module.exports = mongoose.model("CommissionProduct", commissionProductSchema);
