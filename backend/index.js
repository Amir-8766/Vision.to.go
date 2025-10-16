require("dotenv").config();
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connectDB = require("./db");
const path = require("path");
const cloudinary = require("cloudinary").v2;
connectDB();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }

      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/productDetails", require("./routes/productDetails"));
app.use("/orders", require("./routes/orders"));
app.use("/inventory", require("./routes/inventory"));
app.use("/commission", require("./routes/commission"));
app.use("/profile", require("./routes/profile"));
app.use("/wishlist", require("./routes/wishlist"));
app.use("/featured-products", require("./routes/featuredProducts"));
app.use("/partners", require("./routes/partners"));
app.use("/slider", require("./routes/slider"));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// File upload endpoint - Cloudinary
app.post("/upload", (req, res) => {
  const multer = require("multer");
  const path = require("path");
  const fs = require("fs");

  // Ensure uploads directory exists (temporary)
  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage: storage });

  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "visiontogo",
        use_filename: true,
        unique_filename: true,
        resource_type: "auto",
      });

      // Delete temporary file
      fs.unlinkSync(req.file.path);

      res.json({
        message: "File uploaded successfully",
        filename: req.file.filename,
        path: result.secure_url,
        imageUrl: result.secure_url,
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      // Delete temporary file
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: "Failed to upload to Cloudinary" });
    }
  });
});

// Stripe Payment Intent endpoint
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, items, userId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Create simplified items metadata (only essential info)
    const simplifiedItems = (items || []).map((item) => ({
      id: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    }));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in cents
      currency: "eur",
      metadata: {
        userId: userId || "anonymous",
        itemsCount: (items || []).length.toString(),
        items: JSON.stringify(simplifiedItems),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.message.includes("CORS")) {
    return res.status(403).json({
      error: "CORS Error",
      message: err.message,
      allowedOrigins: allowedOrigins,
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
