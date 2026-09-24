const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT token.
 * @param {string} id - Admin document _id
 * @returns {string} Signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Send JWT as an HttpOnly, Secure cookie and return admin data.
 * @param {object} admin - Admin document
 * @param {number} statusCode - HTTP status code
 * @param {object} res - Express response object
 */
const sendTokenCookie = (admin, statusCode, res) => {
  const token = generateToken(admin._id);

  const cookieOptions = {
    httpOnly: true,             // Not accessible via JS — XSS protection
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict",         // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("adminToken", token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    admin: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  });
};

module.exports = { generateToken, sendTokenCookie };
