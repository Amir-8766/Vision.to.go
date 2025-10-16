// backend/models/Inventory.js
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  color: String,
  size: String,
  quantity: { type: Number, default: 0 },
});

module.exports = mongoose.model("Inventory", inventorySchema);
