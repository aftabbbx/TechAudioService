const express = require("express");
const { protect } = require("../middleware/auth");
const { uploadFields } = require("../middleware/upload");
const {
  getAdminCinemaProducts,
  getAdminCinemaProductById,
  createCinemaProduct,
  updateCinemaProduct,
  deleteCinemaProduct,
} = require("../controllers/cinemaController");

const router = express.Router();

router.use(protect);

router.get("/", getAdminCinemaProducts);
router.post("/", uploadFields, createCinemaProduct);
router.get("/:id", getAdminCinemaProductById);
router.put("/:id", uploadFields, updateCinemaProduct);
router.delete("/:id", deleteCinemaProduct);

module.exports = router;
