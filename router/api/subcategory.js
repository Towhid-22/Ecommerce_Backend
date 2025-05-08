const express = require("express");
const { addSubcategoryController } = require("../../controllers/subcategoryController");
const router = express.Router()

router.post("/add-subcategory", addSubcategoryController)

module.exports = router