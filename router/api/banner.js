const express = require("express");
const {
  addBannerOneController,
  getBannerOneController,
  addBannerTwoController,
} = require("../../controllers/bannerController");
const upload = require("../../helpers/uploadimage");
const router = express.Router();
router.post("/addBannerOne", upload.single("image"), addBannerOneController);
router.get("/getBannerOne", getBannerOneController);
module.exports = router;
