const express = require("express");
const { getPublicProducts, getPublicProductBySlug } = require("../controllers/productController");

const router = express.Router();

// Public routes — no auth required
router.get("/", getPublicProducts);
router.get("/:slug", getPublicProductBySlug);

module.exports = router;
