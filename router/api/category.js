const express = require("express");
const path = require("path");
const {
  addcategoryController,
  getAllCategories,
  singleCategory,
  deletecategory,
  updatecategory,
} = require("../../controllers/categoryController");
const router = express.Router();
const upload = require("../../helpers/uploadimage");

// localhost:4000/api/v1/category/addcategory
router.post("/addcategory", upload.single("avatar"), addcategoryController);
router.get("/getcategories", getAllCategories);
router.get("/singleCategory/:slug", singleCategory);
router.delete("/deletecategory/:id", deletecategory);
router.patch("/updatecategory/:id", upload.single("avatar"), updatecategory);

module.exports = router;
