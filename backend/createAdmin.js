// backend/createAdmin.js
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/visiontogo",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function createAdmin() {
  try {
    console.log("🔐 Creating admin user...");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);

      // Generate new token for existing admin
      const token = jwt.sign(
        {
          userId: existingAdmin._id,
          email: existingAdmin.email,
          username: existingAdmin.username,
          role: existingAdmin.role,
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      console.log("✅ New token generated for existing admin:");
      console.log("Token:", token);
      console.log("\n📋 Copy this token and paste it in browser console:");
      console.log(`localStorage.setItem("token", "${token}");`);

      mongoose.connection.close();
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      address: "Admin Address",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");

    // Generate token
    const token = jwt.sign(
      {
        userId: admin._id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    console.log("✅ Admin user created:");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
    console.log("Token:", token);

    console.log("\n📋 Copy this token and paste it in browser console:");
    console.log(`localStorage.setItem("token", "${token}");`);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
createAdmin();
