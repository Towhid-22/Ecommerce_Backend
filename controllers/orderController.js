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
      !cartItems
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
      newOrder.save();
      res.status(200).json({
        success: true,
        message: "Order placed successfully",
        data: newOrder,
      });
    } else {
      let userinfo = await userModel.findById(user);
      const tran_id = Date.now() + Math.random().toString(36).substring(2, 15);

      const data = {
        total_amount: 1100,
        currency: "BDT",
        tran_id: tran_id,
        success_url: `http://localhost:4000/api/v1/order/success/${tran_id}`,
        fail_url: "http://localhost:4000/api/v1/order/fail",
        cancel_url: "http://localhost:3030/cancel",
        ipn_url: "http://localhost:3030/ipn",
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
      sslcz.init(data).then(async (apiResponse) => {
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
          transId : tran_id
        });
        const saveOrder = await newOrder.save();

        let GatewayPageURL = apiResponse.GatewayPageURL;
        // res.redirect(GatewayPageURL);
        return res.status(200).json({
          success: true,
          message: "Payment method online",
          paymenturl: GatewayPageURL,
        });
      });
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
