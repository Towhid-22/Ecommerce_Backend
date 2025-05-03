const categoryModel = require("../model/categoryModel");

async function addcategoryController(req, res) {
  let { name, description } = req.body;
  try {
    let category = new categoryModel({
      name,
      description,
      image: `${process.env.SERVER_URL}/${req.file.filename}`,
    });

    await category.save();

    return res.status(200).json({
      success: true,
      data: category,
      message: "category added successfull",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

async function getAllCategories(req, res) {
  try {
    let allCategories = await categoryModel.find({});
    return res.status(200).json({
      success: true,
      message: "Fetch all category",
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

module.exports = { addcategoryController, getAllCategories };
