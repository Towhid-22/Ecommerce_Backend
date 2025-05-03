const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const categoryRouter = require("./category");

// localhost:4000/api/v1/auth
router.use("/auth", authRouter);
// localhost:4000/api/v1/category
router.use("/category", categoryRouter);

module.exports = router;
