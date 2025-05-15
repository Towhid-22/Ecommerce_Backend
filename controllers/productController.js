const { default: slugify } = require("slugify");
const productModel = require("../model/productModel");
const categoryModel = require("../model/categoryModel");
const subcategoryModel = require("../model/subcategoryModel");

async function addProductController(req, res) {
  try {
    let { title, description, category, subcategory, thumbnail, price } =
      req.body;

    const slug = slugify(title, {
      lower: true,
      replacement: "_",
    });
    const product = new productModel({
      title,
      description,
      category,
      subcategory,
      slug,
      thumbnail: `${process.env.SERVER_URL}/${req.file.filename}`,
      price,
    });

    await product.save();

    const updatecategory = await categoryModel.findOneAndUpdate(
      {
        _id: category,
      },
      { $push: { products: product._id } },
      { new: true }
    );
    
    const updatesubcategory = await subcategoryModel.findOneAndUpdate(
      {
        _id: subcategory,
      },
      { $push: { products: product._id } },
      { new: true }
    );

    await updatecategory.save();
    await updatesubcategory.save();
    res.status(201).json({
      success: true,
      message: "product added successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

module.exports = { addProductController };
