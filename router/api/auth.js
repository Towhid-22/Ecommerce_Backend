const express = require("express");
const {
  signupController,
  loginController,
  otpController,
} = require("../../controllers/authController");
const userModel = require("../../model/userModel");
const { authMiddleware } = require("../../middleware/authMiddleware");
const router = express.Router();

// localhost:4000/api/v1/auth/signup
// signup user
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/checkotp", otpController);
router.get("/authusers", authMiddleware, async (req, res) => {
  try {
    let userdata = await userModel.find({_id:req.session.user.id});
    return res.status(200).json({
      success: true,
      data: userdata,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
});

module.exports = router;
