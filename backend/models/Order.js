// backend/models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  color: String,
  size: String,
  price: Number, // قیمت هر آیتم در زمان سفارش
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "پرداخت شده" }, // یا: "در حال پردازش"، "ارسال شده"، ...
  shippingAddress: String,
  paymentIntentId: String, // برای ارتباط با Stripe
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
