const express = require("express");
const {
  addSubcategoryController,
  deleteSubcategoryController,
  updateSubcategoryController,
  getSubcategoryByCategoryController,
} = require("../../controllers/subcategoryController");
const router = express.Router();

router.post("/add-subcategory", addSubcategoryController);
router.delete("/delete-subcategory/:id", deleteSubcategoryController);
router.patch("/update-subcategory/:id", updateSubcategoryController);
router.get(
  "/get-subcategorybycategory/:id",
  getSubcategoryByCategoryController
);

module.exports = router;
