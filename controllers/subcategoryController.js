const { default: slugify } = require("slugify");
const subcategoryModel = require("../model/subcategoryModel");
const categoryModel = require("../model/categoryModel");

async function addSubcategoryController(req, res) {
  try {
    const { name, description, category } = req.body;
    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
    const subcategory = new subcategoryModel({
      name,
      description,
      slug,
      category,
    });
    await subcategory.save();

    const updatecategory = await categoryModel.findOneAndUpdate(
      { _id: category },
      { $push: { subcategory: subcategory._id } },
      { new: true }
    );

    await updatecategory.save();

    return res.status(200).json({
      success: true,
      data: subcategory,
      message: "subcategory added successfull",
    });
    // res.send(req.body);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

async function deleteSubcategoryController(req, res) {
  try {
    const { id } = req.params;

    const deleteSubcategory = await subcategoryModel.findOneAndDelete({
      _id: id,
    });
    await categoryModel.findOneAndUpdate(
      { subcategory: id },
      { $pull: { subcategory: id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "subcategory delete successfull",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

async function updateSubcategoryController(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });

    const updateSubcategory = await subcategoryModel.findOneAndUpdate(
      {
        _id: id,
      },
      { name, description, slug },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "subcategory update successfull",
      data: updateSubcategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

async function getSubcategoryByCategoryController(req, res) {
  try {
    const { id } = req.params;
    const getsubcategory = await subcategoryModel.find({ category: id })
    return res.status(200).json({
      success: true,
      message: "subcategory fetch successfull",
      data: getsubcategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

module.exports = {
  addSubcategoryController,
  deleteSubcategoryController,
  updateSubcategoryController,
  getSubcategoryByCategoryController,
};
