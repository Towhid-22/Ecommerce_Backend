const express = require("express");
const {
  signupController,
  loginController,
  otpController,
  logOutController,
  resetPasswordController,
} = require("../../controllers/authController");
const userModel = require("../../model/userModel");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

// localhost:4000/api/v1/auth/signup
// signup user
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/checkotp", otpController);
router.post("/logout", logOutController);
router.patch("/reset-password", resetPasswordController);

router.get("/authuser", authMiddleware, async (req, res) => {
  try {
    let userdata = await userModel.findOne({ _id: req.session.user.id });
    let user = {
      username: userdata.username,
      email: userdata.email,
      role: userdata.role,
      _id: userdata._id,
    };
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
