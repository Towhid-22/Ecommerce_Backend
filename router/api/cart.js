const express = require("express");
const {
  addToCartController,
  getCartController,
  deleteCartController,
  updateCartController,
  cartTotalController,
} = require("../../controllers/cartController");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/add-to-cart", addToCartController);
router.get("/get-cartbyuserid/:id", getCartController);
router.delete(
  "/delete-remove-from-cart/:id",
  authMiddleware,
  deleteCartController
);
router.patch("/update-quantity/:id", authMiddleware, updateCartController);
router.get("/cart-total", cartTotalController);

module.exports = router;
