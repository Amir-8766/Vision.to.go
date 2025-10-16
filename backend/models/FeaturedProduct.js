// backend/models/FeaturedProduct.js
const mongoose = require("mongoose");

const featuredProductSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  displayOrder: { 
    type: Number, 
    required: true,
    min: 1,
    max: 4
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  customTitle: { 
    type: String 
  },
  customDescription: { 
    type: String 
  },
  featuredAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Ensure only one product per display order
featuredProductSchema.index({ displayOrder: 1 }, { unique: true });

module.exports = mongoose.model("FeaturedProduct", featuredProductSchema);
