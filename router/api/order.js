const express = require("express");
const { placeOrderController } = require("../../controllers/orderController");
const router = express.Router();


router.post("/place-order", placeOrderController)

module.exports = router;