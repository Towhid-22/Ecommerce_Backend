const express = require("express");
const {
  addToCartController,
  getCartController,
} = require("../../controllers/cartController");
const router = express.Router();

router.post("/add-to-cart", addToCartController);
router.get("/get-cartbyuserid/:id", getCartController);

module.exports = router;
