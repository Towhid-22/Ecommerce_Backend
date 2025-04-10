const express = require("express");
const {
  signupController,
  loginController,
  otpController,
} = require("../../controllers/authController");
const router = express.Router();

// localhost:4000/api/v1/auth/signup
// signup user
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/checkotp", otpController);

module.exports = router;
