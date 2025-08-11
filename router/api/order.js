const express = require("express");
const {
  placeOrderController,
  getOrderController,
} = require("../../controllers/orderController");
const router = express.Router();

router.post("/place-order", placeOrderController);
router.get("/get-order", getOrderController);

module.exports = router;
