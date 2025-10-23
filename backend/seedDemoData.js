// backend/seedDemoData.js
const mongoose = require("mongoose");
const Order = require("./models/Order");
const Product = require("./models/Product");
const User = require("./models/User");

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/visiontogo",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function seedDemoData() {
  try {
    console.log("🌱 Starting to seed demo data...");

    // Get existing products
    const products = await Product.find().limit(10);
    if (products.length === 0) {
      console.log("❌ No products found. Please add some products first.");
      return;
    }

    // Get existing users
    const users = await User.find().limit(5);
    if (users.length === 0) {
      console.log("❌ No users found. Please add some users first.");
      return;
    }

    console.log(
      `📦 Found ${products.length} products and ${users.length} users`
    );

    // Clear existing orders
    await Order.deleteMany({});
    console.log("🗑️ Cleared existing orders");

    // Create demo orders for different months
    const demoOrders = [
      // January 2024
      {
        userId: users[0]._id,
        items: [
          { productId: products[0]._id, quantity: 2, price: products[0].price },
          { productId: products[1]._id, quantity: 1, price: products[1].price },
        ],
        totalPrice: products[0].price * 2 + products[1].price,
        status: "Paid",
        shippingAddress: "123 Main St, Berlin, Germany",
        paymentIntentId: "pi_demo_001",
        createdAt: new Date("2024-01-15"),
      },
      {
        userId: users[1]._id,
        items: [
          { productId: products[2]._id, quantity: 1, price: products[2].price },
        ],
        totalPrice: products[2].price,
        status: "Paid",
        shippingAddress: "456 Oak Ave, Munich, Germany",
        paymentIntentId: "pi_demo_002",
        createdAt: new Date("2024-01-28"),
      },

      // February 2024
      {
        userId: users[0]._id,
        items: [
          { productId: products[3]._id, quantity: 3, price: products[3].price },
          { productId: products[4]._id, quantity: 1, price: products[4].price },
        ],
        totalPrice: products[3].price * 3 + products[4].price,
        status: "Paid",
        shippingAddress: "123 Main St, Berlin, Germany",
        paymentIntentId: "pi_demo_003",
        createdAt: new Date("2024-02-10"),
      },
      {
        userId: users[2]._id,
        items: [
          { productId: products[1]._id, quantity: 2, price: products[1].price },
        ],
        totalPrice: products[1].price * 2,
        status: "Paid",
        shippingAddress: "789 Pine St, Hamburg, Germany",
        paymentIntentId: "pi_demo_004",
        createdAt: new Date("2024-02-22"),
      },

      // March 2024
      {
        userId: users[1]._id,
        items: [
          { productId: products[0]._id, quantity: 1, price: products[0].price },
          { productId: products[5]._id, quantity: 2, price: products[5].price },
        ],
        totalPrice: products[0].price + products[5].price * 2,
        status: "Paid",
        shippingAddress: "456 Oak Ave, Munich, Germany",
        paymentIntentId: "pi_demo_005",
        createdAt: new Date("2024-03-05"),
      },
      {
        userId: users[3]._id,
        items: [
          { productId: products[2]._id, quantity: 1, price: products[2].price },
          { productId: products[6]._id, quantity: 1, price: products[6].price },
        ],
        totalPrice: products[2].price + products[6].price,
        status: "Paid",
        shippingAddress: "321 Elm St, Cologne, Germany",
        paymentIntentId: "pi_demo_006",
        createdAt: new Date("2024-03-18"),
      },

      // April 2024
      {
        userId: users[0]._id,
        items: [
          { productId: products[7]._id, quantity: 2, price: products[7].price },
        ],
        totalPrice: products[7].price * 2,
        status: "Paid",
        shippingAddress: "123 Main St, Berlin, Germany",
        paymentIntentId: "pi_demo_007",
        createdAt: new Date("2024-04-12"),
      },
      {
        userId: users[2]._id,
        items: [
          { productId: products[3]._id, quantity: 1, price: products[3].price },
          { productId: products[8]._id, quantity: 1, price: products[8].price },
        ],
        totalPrice: products[3].price + products[8].price,
        status: "Paid",
        shippingAddress: "789 Pine St, Hamburg, Germany",
        paymentIntentId: "pi_demo_008",
        createdAt: new Date("2024-04-25"),
      },

      // May 2024
      {
        userId: users[1]._id,
        items: [
          { productId: products[4]._id, quantity: 3, price: products[4].price },
        ],
        totalPrice: products[4].price * 3,
        status: "Paid",
        shippingAddress: "456 Oak Ave, Munich, Germany",
        paymentIntentId: "pi_demo_009",
        createdAt: new Date("2024-05-08"),
      },
      {
        userId: users[4]._id,
        items: [
          { productId: products[9]._id, quantity: 1, price: products[9].price },
          { productId: products[0]._id, quantity: 1, price: products[0].price },
        ],
        totalPrice: products[9].price + products[0].price,
        status: "Paid",
        shippingAddress: "654 Maple Dr, Frankfurt, Germany",
        paymentIntentId: "pi_demo_010",
        createdAt: new Date("2024-05-20"),
      },

      // June 2024
      {
        userId: users[0]._id,
        items: [
          { productId: products[1]._id, quantity: 2, price: products[1].price },
          { productId: products[5]._id, quantity: 1, price: products[5].price },
        ],
        totalPrice: products[1].price * 2 + products[5].price,
        status: "Paid",
        shippingAddress: "123 Main St, Berlin, Germany",
        paymentIntentId: "pi_demo_011",
        createdAt: new Date("2024-06-03"),
      },
      {
        userId: users[3]._id,
        items: [
          { productId: products[6]._id, quantity: 2, price: products[6].price },
        ],
        totalPrice: products[6].price * 2,
        status: "Paid",
        shippingAddress: "321 Elm St, Cologne, Germany",
        paymentIntentId: "pi_demo_012",
        createdAt: new Date("2024-06-15"),
      },

      // July 2024
      {
        userId: users[2]._id,
        items: [
          { productId: products[7]._id, quantity: 1, price: products[7].price },
          { productId: products[8]._id, quantity: 1, price: products[8].price },
        ],
        totalPrice: products[7].price + products[8].price,
        status: "Paid",
        shippingAddress: "789 Pine St, Hamburg, Germany",
        paymentIntentId: "pi_demo_013",
        createdAt: new Date("2024-07-07"),
      },
      {
        userId: users[1]._id,
        items: [
          { productId: products[9]._id, quantity: 3, price: products[9].price },
        ],
        totalPrice: products[9].price * 3,
        status: "Paid",
        shippingAddress: "456 Oak Ave, Munich, Germany",
        paymentIntentId: "pi_demo_014",
        createdAt: new Date("2024-07-19"),
      },

      // August 2024
      {
        userId: users[0]._id,
        items: [
          { productId: products[0]._id, quantity: 2, price: products[0].price },
          { productId: products[2]._id, quantity: 1, price: products[2].price },
        ],
        totalPrice: products[0].price * 2 + products[2].price,
        status: "Paid",
        shippingAddress: "123 Main St, Berlin, Germany",
        paymentIntentId: "pi_demo_015",
        createdAt: new Date("2024-08-11"),
      },
      {
        userId: users[4]._id,
        items: [
          { productId: products[3]._id, quantity: 1, price: products[3].price },
        ],
        totalPrice: products[3].price,
        status: "Paid",
        shippingAddress: "654 Maple Dr, Frankfurt, Germany",
        paymentIntentId: "pi_demo_016",
        createdAt: new Date("2024-08-24"),
      },

      // September 2024
      {
        userId: users[3]._id,
        items: [
          { productId: products[4]._id, quantity: 2, price: products[4].price },
          { productId: products[5]._id, quantity: 1, price: products[5].price },
        ],
        totalPrice: products[4].price * 2 + products[5].price,
        status: "Paid",
        shippingAddress: "321 Elm St, Cologne, Germany",
        paymentIntentId: "pi_demo_017",
        createdAt: new Date("2024-09-06"),
      },
      {
        userId: users[1]._id,
        items: [
          { productId: products[6]._id, quantity: 1, price: products[6].price },
        ],
        totalPrice: products[6].price,
        status: "Paid",
        shippingAddress: "456 Oak Ave, Munich, Germany",
        paymentIntentId: "pi_demo_018",
        createdAt: new Date("2024-09-18"),
      },

      // October 2024
      {
        userId: users[2]._id,
        items: [
          { productId: products[7]._id, quantity: 3, price: products[7].price },
        ],
        totalPrice: products[7].price * 3,
        status: "Paid",
        shippingAddress: "789 Pine St, Hamburg, Germany",
        paymentIntentId: "pi_demo_019",
        createdAt: new Date("2024-10-09"),
      },
      {
        userId: users[0]._id,
        items: [
          { productId: products[8]._id, quantity: 1, price: products[8].price },
          { productId: products[9]._id, quantity: 1, price: products[9].price },
        ],
        totalPrice: products[8].price + products[9].price,
        status: "Paid",
        shippingAddress: "123 Main St, Berlin, Germany",
        paymentIntentId: "pi_demo_020",
        createdAt: new Date("2024-10-22"),
      },

      // November 2024
      {
        userId: users[4]._id,
        items: [
          { productId: products[0]._id, quantity: 1, price: products[0].price },
          { productId: products[1]._id, quantity: 2, price: products[1].price },
        ],
        totalPrice: products[0].price + products[1].price * 2,
        status: "Paid",
        shippingAddress: "654 Maple Dr, Frankfurt, Germany",
        paymentIntentId: "pi_demo_021",
        createdAt: new Date("2024-11-05"),
      },
      {
        userId: users[3]._id,
        items: [
          { productId: products[2]._id, quantity: 2, price: products[2].price },
        ],
        totalPrice: products[2].price * 2,
        status: "Paid",
        shippingAddress: "321 Elm St, Cologne, Germany",
        paymentIntentId: "pi_demo_022",
        createdAt: new Date("2024-11-17"),
      },

      // December 2024
      {
        userId: users[1]._id,
        items: [
          { productId: products[3]._id, quantity: 1, price: products[3].price },
          { productId: products[4]._id, quantity: 1, price: products[4].price },
        ],
        totalPrice: products[3].price + products[4].price,
        status: "Paid",
        shippingAddress: "456 Oak Ave, Munich, Germany",
        paymentIntentId: "pi_demo_023",
        createdAt: new Date("2024-12-08"),
      },
      {
        userId: users[0]._id,
        items: [
          { productId: products[5]._id, quantity: 3, price: products[5].price },
        ],
        totalPrice: products[5].price * 3,
        status: "Paid",
        shippingAddress: "123 Main St, Berlin, Germany",
        paymentIntentId: "pi_demo_024",
        createdAt: new Date("2024-12-20"),
      },
    ];

    // Insert demo orders
    const createdOrders = await Order.insertMany(demoOrders);
    console.log(`✅ Created ${createdOrders.length} demo orders`);

    // Calculate and display statistics
    const totalRevenue = createdOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    console.log(`💰 Total Revenue: ${totalRevenue.toFixed(2)}€`);

    const monthlyStats = {};
    createdOrders.forEach((order) => {
      const month = order.createdAt.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!monthlyStats[month]) {
        monthlyStats[month] = { revenue: 0, orders: 0 };
      }
      monthlyStats[month].revenue += order.totalPrice;
      monthlyStats[month].orders += 1;
    });

    console.log("\n📊 Monthly Statistics:");
    Object.entries(monthlyStats).forEach(([month, stats]) => {
      console.log(
        `${month}: ${stats.orders} orders, ${stats.revenue.toFixed(2)}€ revenue`
      );
    });

    console.log("\n🎉 Demo data seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding demo data:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeding function
seedDemoData();
