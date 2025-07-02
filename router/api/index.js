const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const categoryRouter = require("./category");
const subcategoryRouter = require("./subcategory");
const productRouter = require("./product");
const variantRouter = require("./variant");
const cartRouter = require("./cart");
const bannerRouter = require("./banner");

// localhost:4000/api/v1/auth
router.use("/auth", authRouter);
// localhost:4000/api/v1/category
router.use("/category", categoryRouter);
// localhost:4000/api/v1/subcategory
router.use("/subcategory", subcategoryRouter);
// localhost:4000/api/v1/product
router.use("/product", productRouter);
// localhost:4000/api/v1/variant
router.use("/variant", variantRouter);
// localhost:4000/api/v1/cart
router.use("/cart", cartRouter);
// localhost:4000/api/v1/banner
router.use("/banner", bannerRouter);

module.exports = router;
