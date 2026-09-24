const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

/**
 * Verify JWT from HttpOnly cookie.
 * Attaches admin user to req.admin.
 */
const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in.",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please log in again.",
      });
    }

    // Fetch admin (exclude password)
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
};

module.exports = { protect };
