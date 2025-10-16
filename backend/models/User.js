const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // یا email
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  first_name: String,
  last_name: String,
  phone: String,
  address: String,
  role: { type: String, default: "user" },
  googleId: String, // For Google OAuth
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  resetPasswordToken: String, // For password reset
  resetPasswordExpires: Date, // Token expiration date
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationExpires: Date,
});

module.exports = mongoose.model("User", userSchema);
