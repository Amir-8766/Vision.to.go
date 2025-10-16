const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Website must be a valid URL",
      },
    },
    instagram: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional field
          return /^https?:\/\/.+/.test(v);
        },
        message: "Instagram must be a valid URL",
      },
    },
    category: {
      type: String,
      required: true,
      enum: [
        "education", // Education & Training
        "natural_products", // Natural Products
        "fashion", // Fashion & Clothing
        "health_wellness", // Health & Wellness
        "beauty", // Beauty
        "sustainability", // Sustainability
        "other", // Other
      ],
    },
    services: [
      {
        type: String,
        trim: true,
      },
    ],
    logo: {
      type: String, // URL to logo image
      default: null,
    },
    featuredImage: {
      type: String, // URL to featured image
      default: null,
    },
    contactInfo: {
      email: {
        type: String,
        validate: {
          validator: function (v) {
            if (!v) return true; // Optional field
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: "Email must be valid",
        },
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    partnershipType: {
      type: String,
      enum: ["geschaeftspartner", "synergin"],
      required: true,
    },
    specialOffers: {
      type: String,
      trim: true,
    },
    discountCode: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
partnerSchema.index({ category: 1, isActive: 1 });
partnerSchema.index({ displayOrder: 1 });
partnerSchema.index({ partnershipType: 1 });

module.exports = mongoose.model("Partner", partnerSchema);
