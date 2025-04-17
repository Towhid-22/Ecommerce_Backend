const emailValidation = require("../helpers/emailValidation");
const random_OTP = require("../helpers/random-otp");
const sendEmail = require("../helpers/sendEmail");
const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupController = async (req, res) => {
  let { username, email, password, address, city, country, phone } = req.body;
  try {
    const otp = random_OTP();
    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Something went wrong",
        });
      } else {
        if (!emailValidation(email)) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid email",
          });
        } else {
          let user = new userModel({
            username,
            email,
            password: hash,
            address,
            city,
            country,
            phone,
            otp,
          });

          await user.save();
          sendEmail(email, otp);

          // setTimeout(() => {
          //   userModel.findOneAndUpdate({ email }, { otp: null }).then(() => {
          //     console.log(email, "OTP deleted");
          //   });
          //   user.save();
          // }, 30000);

          return res.status(201).json({
            success: true,
            message: "User created successfully",
            user,
          });
        }
      }
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};
const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else {
      bcrypt.compare(password, existingUser.password, function (err, result) {
        if (!err) {
          if (result) {
            const userData = {
              id: existingUser._id,
              email: existingUser.email,
              role: existingUser.role,
            };
            req.session.user = userData;

            return res.status(200).json({
              message: "Login Sccessfull",
              data: userData,
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "Password not matched",
            });
          }
        } else {
          return res.status(500).json({
            success: false,
            message: err,
          });
        }
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const otpController = async (req, res) => {
  let { email, otp } = req.body;
  // res.send(req.body);
  try {
    const otpverify = await userModel.findOne({ email });
    if (!otpverify) {
      return res.status(400).json({
        success: false,
        message: "Email not found",
      });
    } else if (otpverify.otp == otp) {
      otpverify.isVerify = true;
      otpverify.otp = null;
      await otpverify.save();
      return res.status(200).json({
        success: true,
        message: "User verified successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "OTP not matched",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

module.exports = { signupController, loginController, otpController };
