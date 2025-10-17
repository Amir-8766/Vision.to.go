const mongoose = require("mongoose");

const sliderImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String },
    alt: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

sliderImageSchema.index({ order: 1 });

module.exports = mongoose.model("SliderImage", sliderImageSchema);


