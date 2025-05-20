const express = require("express");
const {
  addProductController,
  getProductsController,
  getSingleProductController,
} = require("../../controllers/productController");
const router = express.Router();
const upload = require("../../helpers/uploadimage");

router.post("/add-product", upload.single("thumbnail"), addProductController);
router.get("/get-products", getProductsController);
router.get("/single-product/:id", getSingleProductController);


module.exports = router;
