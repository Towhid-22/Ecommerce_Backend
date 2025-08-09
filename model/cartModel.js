const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },
     totalPrice: {
      type: Number,
    },
    price: {
      type: Number,
    },
   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
