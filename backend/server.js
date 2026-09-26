require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const adminProductRoutes = require("./routes/adminProducts");
const publicCinemaRoutes = require("./routes/publicCinema");
const adminCinemaRoutes = require("./routes/adminCinema");
const downloadRoute = require("./routes/download");
const categoryRoutes = require("./routes/categories");
const adminCategoryRoutes = require("./routes/adminCategories");

const app = express();

// Trust proxy is required when hosting on Render/Vercel to get real IP for rate limiting
app.set("trust proxy", 1);

// ─────────────────────────────────────────────
//  Connect to MongoDB
// ─────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────
//  Security Middleware
// ─────────────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // Allow Cloudinary images in img tags
  })
);

// CORS — allow localhost (dev) and the deployed Vercel frontend
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "https://tech-audio-service.vercel.app",
  "https://audiotechservices.vercel.app",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman) and allowed origins
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all for now — tighten if needed
      }
    },
    credentials: true, // Required for HttpOnly cookie exchange
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Global API rate limiter — 200 req per 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Increased heavily because AutoRefresh pings every 3 seconds
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
});
app.use(globalLimiter);

// ─────────────────────────────────────────────
//  Body & Cookie Parsers
// ─────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Serve static fallback files (e.g. PDFs that failed to upload to Cloudinary)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// ─────────────────────────────────────────────
//  API Routes
// ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/cinema", publicCinemaRoutes);
app.use("/api/admin/cinema", adminCinemaRoutes);
app.use("/api/download", downloadRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "AudioTechServices API is running." });
});

// ─────────────────────────────────────────────
//  404 Handler
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ─────────────────────────────────────────────
//  Global Error Handler
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File too large. Maximum size is 5MB.",
    });
  }

  // Multer file type error
  if (err.message?.includes("Invalid file type")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

// ─────────────────────────────────────────────
//  Start Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AudioTechServices API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
});
