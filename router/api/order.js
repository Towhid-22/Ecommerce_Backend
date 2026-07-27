const orderModel = require("../../model/orderModel");
const express = require("express");
const {
  placeOrderController,
  getOrderController,
} = require("../../controllers/orderController");
const router = express.Router();

router.post("/place-order", placeOrderController);
router.get("/get-order", getOrderController);

router.post("/success/:id", async (req, res) => {
  const { id } = req.params;
  let order = await orderModel.findOneAndUpdate(
    { transId: id },
    { paymentStatus: "paid", orderStatus: "processing" },
    { new: true },
  );
  await order.save();
  return res.redirect(`${process.env.FRONTEND_URL}/success`);
});

router.post("/fail", (req, res) => {
  return res.redirect(`${process.env.FRONTEND_URL}/fail`);
});

module.exports = router;
