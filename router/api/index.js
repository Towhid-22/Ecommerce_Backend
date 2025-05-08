const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const categoryRouter = require("./category");
const subcategoryRouter = require("./subcategory");

// localhost:4000/api/v1/auth
router.use("/auth", authRouter);
// localhost:4000/api/v1/category
router.use("/category", categoryRouter);
// localhost:4000/api/v1/subcategory
router.use("/subcategory", subcategoryRouter);

module.exports = router;
