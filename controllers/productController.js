const { default: slugify } = require("slugify");
const productModel = require("../model/productModel");
const categoryModel = require("../model/categoryModel");
const subcategoryModel = require("../model/subcategoryModel");
const { all } = require("../router/api/variant");

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

    if (subcategory) {
      const updatesubcategory = await subcategoryModel.findOneAndUpdate(
        {
          _id: subcategory,
        },
        { $push: { products: product._id } },
        { new: true }
      );
      await updatesubcategory.save();
    }

    await updatecategory.save();
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

async function getProductsController(req, res) {
  try {
    const allProducts = await productModel
      .find({})
      .populate("variant category subcategory");
    return res.status(200).json({
      success: true,
      message: "all products",
      data: allProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

async function getSingleProductController(req, res) {
  const { id } = req.params;
  try {
    const singleproduct = await productModel
      .findById(id)
      .populate("variant category subcategory");

    if (!singleproduct) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "single product",
        data: singleproduct,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

module.exports = {
  addProductController,
  getProductsController,
  getSingleProductController,
};
