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
      { $push: { subcategory: subcategory._id } },{ new: true }
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

module.exports = { addSubcategoryController };
