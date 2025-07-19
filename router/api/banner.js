const express = require("express");
const {
  addBannerOneController,
  getBannerOneController,
  deleteBannerOneController,
} = require("../../controllers/bannerController");
const upload = require("../../helpers/uploadimage");
const router = express.Router();
router.post("/addBannerOne", upload.single("image"), addBannerOneController);
router.get("/getBannerOne", getBannerOneController);
router.delete("/deleteBannerOne/:id", deleteBannerOneController);
module.exports = router;
