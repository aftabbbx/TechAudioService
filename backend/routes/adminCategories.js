const express = require("express");
const { protect } = require("../middleware/auth");
const {
  listAdminCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.use(protect);
router.get("/", listAdminCategories);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
