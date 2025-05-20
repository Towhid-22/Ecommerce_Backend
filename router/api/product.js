const express = require("express");
const {
  addProductController,
  getProductsController,
  getSingleProductController,
  deleteProductController,
} = require("../../controllers/productController");
const router = express.Router();
const upload = require("../../helpers/uploadimage");

router.post("/add-product", upload.single("thumbnail"), addProductController);
router.get("/get-products", getProductsController);
router.get("/single-product/:id", getSingleProductController);
router.delete("/delete-product/:id", deleteProductController);

module.exports = router;
