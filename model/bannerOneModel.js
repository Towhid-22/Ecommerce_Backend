const { default: mongoose } = require("mongoose");

const bannerOneSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BannerOne", bannerOneSchema);