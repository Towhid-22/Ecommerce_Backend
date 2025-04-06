const express = require("express");
const router = express.Router();

// localhost:4000/api/v1/auth/signup
// signup user
router.post("/signup", (req,res)=>{
  res.send("signup")
})

module.exports = router;
