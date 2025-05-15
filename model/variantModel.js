const { default: mongoose } = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    color: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "4XL", "5XL", "6XL"],
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
      trim: true,
    },
    image: {
      type: String,
    },
    sku: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Variant", variantSchema);
