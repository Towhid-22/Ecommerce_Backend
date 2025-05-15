const express = require("express");
const { addProductController, getProductsController } = require("../../controllers/productController");
const router = express.Router();
const upload = require("../../helpers/uploadimage");

router.post("/add-product", upload.single("thumbnail"), addProductController);
router.get("/get-products", getProductsController);

module.exports = router;
