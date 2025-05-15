const express = require("express");
const {
  add_variantController,
} = require("../../controllers/variantsController");
const upload = require("../../helpers/uploadimage");
const router = express.Router();

// localhost:4000/api/v1/variant/add-variant
router.post("/add-variant", upload.single("image"), add_variantController);

module.exports = router;
