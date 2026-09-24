const express = require("express");
const { protect } = require("../middleware/auth");
const { uploadFields } = require("../middleware/upload");
const {
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// All admin product routes require JWT authentication
router.use(protect);

router.get("/", getAdminProducts);
router.post("/", uploadFields, createProduct);
router.get("/:id", getAdminProductById);
router.put("/:id", uploadFields, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
