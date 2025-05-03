const express = require("express");
const path = require("path");
const {
  addcategoryController,
  getAllCategories,
} = require("../../controllers/categoryController");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const extensionName = file.mimetype.split("/");
    console.log(extensionName);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        extensionName[extensionName.length - 1]
    );
  },
});
// check file type for upload
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|mp4/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only! (jpeg, jpg, png, gif)");
  }
}
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// localhost:4000/api/v1/category/addcategory
router.post("/addcategory", upload.single("avatar"), addcategoryController);
router.get("/getcategories", getAllCategories);

module.exports = router;
