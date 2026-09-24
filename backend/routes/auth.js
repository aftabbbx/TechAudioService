const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { login, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { handleValidation } = require("../middleware/validate");

const router = express.Router();

// Login rate limiter — max 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules for login
const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email."),
  body("password").notEmpty().withMessage("Password is required."),
];

// Routes
router.post("/login", loginLimiter, loginValidation, handleValidation, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
