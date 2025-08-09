const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
  cartItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      quantity: {
        type: Number,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "online"],
    default: "COD",
  },
  totalprice: {
    type: Number,
  },
  paymentStatus: {
    type: String,
    enum: ["notpaid", "paid"],
    default: "notpaid",
  },
  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
