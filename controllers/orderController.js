const cartModel = require("../model/cartModel");
const orderModel = require("../model/orderModel");

async function placeOrderController(req, res) {
  try {
    const {
      user,
      phone,
      address,
      city,
      postcode,
      paymentMethod,
      cartItems,
      totalprice,
    } = req.body;

    if (
      !user ||
      !phone ||
      !address ||
      !city ||
      !postcode ||
      !paymentMethod ||
      !cartItems
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    } else {
      if (paymentMethod == "COD") {
        const newOrder = new orderModel({
          cartItems,
          user,
          phone,
          address,
          city,
          postcode,
          paymentMethod,
        });
        newOrder.save();
        res.status(200).json({
          success: true,
          message: "Order placed successfully",
          data: newOrder,
        });
      } else {
        return res
          .status(400)
          .json({ success: true, message: "Payment method online" });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getOrderController(req, res) {
  try {
    const orders = await orderModel
      .find()
      .populate("user")
      .populate("cartItems.product")
      .populate("cartItems.quantity");
    res.status(200).json({
      success: true,
      message: "Order Fetch Successfull",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { placeOrderController, getOrderController };
