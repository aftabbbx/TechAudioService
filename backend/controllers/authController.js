const Admin = require("../models/Admin");
const { sendTokenCookie } = require("../utils/token");

/**
 * POST /api/auth/login
 * Authenticate admin with email + password.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin and explicitly select password field
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password with bcrypt
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    // Send JWT in HttpOnly cookie
    sendTokenCookie(admin, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

/**
 * POST /api/auth/logout
 * Clear the auth cookie.
 */
const logout = (req, res) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

/**
 * GET /api/auth/me
 * Return the currently authenticated admin.
 */
const getMe = async (req, res) => {
  try {
    const admin = req.admin; // Set by protect middleware
    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = { login, logout, getMe };
