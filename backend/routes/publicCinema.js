const express = require("express");
const { getPublicCinemaProducts } = require("../controllers/cinemaController");

const router = express.Router();

router.get("/", getPublicCinemaProducts);

module.exports = router;
