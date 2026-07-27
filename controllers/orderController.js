const orderModel = require("../model/orderModel");
const userModel = require("../model/userModel");

// ! sslcommerz details
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_PASSWORD;
const is_live = false; //true for live, false for sandbox

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
      !cartItems ||
      !totalprice
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (paymentMethod == "COD") {
      const newOrder = new orderModel({
        cartItems,
        user,
        phone,
        address,
        city,
        postcode,
        paymentMethod,
        paymentStatus: "notpaid",
        totalprice,
      });

      const savedOrder = await newOrder.save();

      return res.status(200).json({
        success: true,
        message: "Order placed successfully",
        data: savedOrder,
      });
    } else {
      const userinfo = await userModel.findById(user);

      if (!userinfo) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const tran_id = Date.now() + Math.random().toString(36).substring(2, 15);

      const data = {
        total_amount: totalprice, // was hardcoded to 1100 — must match actual order total
        currency: "BDT",
        tran_id: tran_id,
        success_url: `${process.env.SERVER_URL}/api/v1/order/success/${tran_id}`,
        fail_url: `${process.env.SERVER_URL}/api/v1/order/fail`,
        cancel_url: `${process.env.SERVER_URL}/api/v1/order/cancel`, // was hardcoded localhost:3030
        ipn_url: `${process.env.SERVER_URL}/api/v1/order/ipn`, // was hardcoded localhost:3030
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: userinfo.username,
        cus_email: userinfo.email,
        cus_add1: address,
        cus_add2: "Dhaka",
        cus_city: city,
        cus_state: "Dhaka",
        cus_postcode: postcode,
        cus_country: "Bangladesh",
        cus_phone: phone,
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

      try {
        const apiResponse = await sslcz.init(data);

        const newOrder = new orderModel({
          cartItems,
          user,
          phone,
          address,
          city,
          postcode,
          paymentMethod,
          paymentStatus: "notpaid",
          totalprice,
          transId: tran_id,
        });

        await newOrder.save();

        const GatewayPageURL = apiResponse.GatewayPageURL;

        if (!GatewayPageURL) {
          return res.status(502).json({
            success: false,
            message: "Failed to initiate payment gateway",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Payment method online",
          paymenturl: GatewayPageURL,
        });
      } catch (sslczError) {
        return res.status(500).json({
          success: false,
          message: sslczError.message || "Payment initialization failed",
        });
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
      .populate("user", "_id username email")
      .populate("cartItems.product", "_id title thumbnail price")
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
