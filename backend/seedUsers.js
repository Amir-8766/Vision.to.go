// backend/seedUsers.js
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/visiontogo",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function seedUsers() {
  try {
    console.log("🌱 Starting to seed users...");

    // Clear existing users (except admin)
    await User.deleteMany({ role: { $ne: "admin" } });
    console.log("🗑️ Cleared existing non-admin users");

    // Create demo users
    const demoUsers = [
      {
        username: "john_doe",
        email: "john.doe@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St, Berlin, Germany",
      },
      {
        username: "jane_smith",
        email: "jane.smith@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        firstName: "Jane",
        lastName: "Smith",
        address: "456 Oak Ave, Munich, Germany",
      },
      {
        username: "mike_wilson",
        email: "mike.wilson@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        firstName: "Mike",
        lastName: "Wilson",
        address: "789 Pine St, Hamburg, Germany",
      },
      {
        username: "sarah_jones",
        email: "sarah.jones@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        firstName: "Sarah",
        lastName: "Jones",
        address: "321 Elm St, Cologne, Germany",
      },
      {
        username: "david_brown",
        email: "david.brown@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
        firstName: "David",
        lastName: "Brown",
        address: "654 Maple Dr, Frankfurt, Germany",
      },
    ];

    // Insert demo users
    const createdUsers = await User.insertMany(demoUsers);
    console.log(`✅ Created ${createdUsers.length} demo users`);

    // Display user summary
    console.log("\n👥 User Summary:");
    createdUsers.forEach((user) => {
      console.log(
        `- ${user.firstName} ${user.lastName} (${user.username}) - ${user.email}`
      );
    });

    console.log("\n🎉 User seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeding function
seedUsers();
