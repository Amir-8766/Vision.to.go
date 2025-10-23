// backend/seedProducts.js
const mongoose = require("mongoose");
const Product = require("./models/Product");

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/visiontogo",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function seedProducts() {
  try {
    console.log("🌱 Starting to seed products...");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️ Cleared existing products");

    // Create demo products
    const demoProducts = [
      {
        name: "Premium Travel Backpack",
        description:
          "High-quality waterproof travel backpack with multiple compartments",
        price: 89.99,
        originalPrice: 120.0,
        category: "Travel",
        images: ["backpack1.jpg"],
        stock: 50,
        isDiscounted: true,
        discountLabel: "25% OFF",
      },
      {
        name: "Luxury Cosmetic Bag",
        description: "Elegant cosmetic bag made from premium PU leather",
        price: 45.5,
        originalPrice: 65.0,
        category: "Beauty",
        images: ["cosmetic1.jpg"],
        stock: 30,
        isDiscounted: true,
        discountLabel: "30% OFF",
      },
      {
        name: "Sports Gym Bag",
        description:
          "Durable sports bag perfect for gym and outdoor activities",
        price: 35.99,
        originalPrice: 50.0,
        category: "Sports",
        images: ["gym1.jpg"],
        stock: 40,
        isDiscounted: true,
        discountLabel: "28% OFF",
      },
      {
        name: "Business Briefcase",
        description: "Professional leather briefcase for business meetings",
        price: 125.0,
        originalPrice: 150.0,
        category: "Business",
        images: ["briefcase1.jpg"],
        stock: 25,
        isDiscounted: true,
        discountLabel: "17% OFF",
      },
      {
        name: "Weekend Travel Bag",
        description: "Compact weekend travel bag with wheels",
        price: 75.99,
        originalPrice: 95.0,
        category: "Travel",
        images: ["weekend1.jpg"],
        stock: 35,
        isDiscounted: true,
        discountLabel: "20% OFF",
      },
      {
        name: "Designer Handbag",
        description: "Fashionable designer handbag for everyday use",
        price: 95.5,
        originalPrice: 130.0,
        category: "Fashion",
        images: ["handbag1.jpg"],
        stock: 20,
        isDiscounted: true,
        discountLabel: "27% OFF",
      },
      {
        name: "Laptop Sleeve",
        description: "Protective laptop sleeve with padding",
        price: 25.99,
        originalPrice: 35.0,
        category: "Electronics",
        images: ["laptop1.jpg"],
        stock: 60,
        isDiscounted: true,
        discountLabel: "26% OFF",
      },
      {
        name: "Outdoor Hiking Pack",
        description: "Heavy-duty hiking backpack for outdoor adventures",
        price: 110.0,
        originalPrice: 140.0,
        category: "Outdoor",
        images: ["hiking1.jpg"],
        stock: 15,
        isDiscounted: true,
        discountLabel: "21% OFF",
      },
      {
        name: "Elegant Evening Bag",
        description: "Small elegant evening bag for special occasions",
        price: 55.99,
        originalPrice: 75.0,
        category: "Fashion",
        images: ["evening1.jpg"],
        stock: 45,
        isDiscounted: true,
        discountLabel: "25% OFF",
      },
      {
        name: "Multi-Purpose Tote",
        description: "Versatile tote bag for shopping and daily use",
        price: 40.5,
        originalPrice: 55.0,
        category: "Daily",
        images: ["tote1.jpg"],
        stock: 50,
        isDiscounted: true,
        discountLabel: "26% OFF",
      },
    ];

    // Insert demo products
    const createdProducts = await Product.insertMany(demoProducts);
    console.log(`✅ Created ${createdProducts.length} demo products`);

    // Display product summary
    console.log("\n📦 Product Summary:");
    createdProducts.forEach((product) => {
      console.log(
        `- ${product.name}: ${product.price}€ (was ${product.originalPrice}€) - ${product.discountLabel}`
      );
    });

    console.log("\n🎉 Product seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeding function
seedProducts();
