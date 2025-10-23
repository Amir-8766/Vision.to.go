// backend/updateOrdersAdmin.js
const mongoose = require("mongoose");
const Order = require("./models/Order");
const User = require("./models/User");

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/visiontogo",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function updateOrdersAdmin() {
  try {
    console.log("🔄 Updating orders to use admin user...");

    // Get admin user
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      console.log("❌ No admin user found");
      return;
    }

    console.log("Admin ID:", admin._id);

    // Update all orders to use admin as the user
    const result = await Order.updateMany({}, { $set: { userId: admin._id } });

    console.log(`✅ Updated ${result.modifiedCount} orders to use admin user`);

    // Verify the update
    const orders = await Order.find().populate("userId");
    console.log(`📊 Total orders: ${orders.length}`);

    orders.forEach((order) => {
      console.log(
        `- Order ${order._id}: User ${
          order.userId?.email || "Unknown"
        }, Total: ${order.totalPrice}€`
      );
    });
  } catch (error) {
    console.error("❌ Error updating orders:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
updateOrdersAdmin();
