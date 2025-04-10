const emailValidation = require("../helpers/emailValidation");
const random_OTP = require("../helpers/random-otp");
const sendEmail = require("../helpers/sendEmail");
const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");

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

          setTimeout(() => {
            userModel.findOneAndUpdate({ email }, { otp: null }).then(() => {
              console.log(email, "OTP deleted");
            });
            user.save();
          }, 20000);

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
const loginController = (req, res) => {
  res.send("login user route");
  // res.send(random_OTP());
};

module.exports = { signupController, loginController };
