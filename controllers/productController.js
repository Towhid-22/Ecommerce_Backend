const { default: slugify } = require("slugify");
const productModel = require("../model/productModel");
const categoryModel = require("../model/categoryModel");
const subcategoryModel = require("../model/subcategoryModel");
const { all } = require("../router/api/variant");
const path = require("path");
const fs = require("fs");

async function addProductController(req, res) {
  try {
    let { title, description, category, subcategory, thumbnail, price, stock } =
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
      stock,
    });

    await product.save();

    const updatecategory = await categoryModel.findOneAndUpdate(
      {
        _id: category,
      },
      { $push: { products: product._id } },
      { new: true },
    );

    if (subcategory) {
      const updatesubcategory = await subcategoryModel.findOneAndUpdate(
        {
          _id: subcategory,
        },
        { $push: { products: product._id } },
        { new: true },
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

// async function getProductsController(req, res) {
//   const { category, minprice, maxprice, sort } = req.query;

//   try {
//     const sortOption = {
//       ...(sort === "newest" && { createdAt: -1 }),
//       ...(sort === "oldest" && { createdAt: 1 }),
//       ...(sort === "low_to_high" && { price: 1 }),
//       ...(sort === "high_to_low" && { price: -1 }),
//       ...(sort === "name_asc" && { name: 1 }),
//       ...(sort === "name_desc" && { name: -1 }),
//     };
//     const allProducts = await productModel
//       .find({
//         ...(category && { category }),
//         ...(minprice && { price: { $gte: minprice } }),
//         ...(maxprice && { price: { $lte: maxprice } }),
//       })
//       .populate("variant category subcategory")
//       .sort(Object.keys(sortOption).length ? sortOption : { createdAt: -1 });
//     return res.status(200).json({
//       success: true,
//       message: "all products",
//       data: allProducts,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "something went wrong",
//     });
//   }
// }

const getProductsController = async (req, res) => {
  const { category, minprice, maxprice, sort } = req.query;

  try {
    // Sort options
    const sortOption = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      low_to_high: { price: 1 },
      high_to_low: { price: -1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 },
    };

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (minprice || maxprice) {
      filter.price = {};
      if (minprice) filter.price.$gte = Number(minprice);
      if (maxprice) filter.price.$lte = Number(maxprice);
    }

    // Fetch products
    const allProducts = await productModel
      .find(filter)
      .populate("variant category subcategory")
      .sort(sortOption[sort] || { createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All products fetched successfully",
      data: allProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

async function getSingleProductController(req, res) {
  const { slug } = req.params;
  try {
    const singleproduct = await productModel
      .findOne({ slug: slug })
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

async function deleteProductController(req, res) {
  try {
    const { id } = req.params;
    const deleteproduct = await productModel.findByIdAndDelete(id);

    if (!deleteproduct) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    } else {
      const oldpath = path.join(__dirname, "../uploads");
      const fullimagepath = deleteproduct.thumbnail?.split("/");
      const imagepath = fullimagepath[fullimagepath.length - 1];
      fs.unlink(`${oldpath}/${imagepath}`, async (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message || "something went wrong",
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "product delete successfull",
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

async function featuresProductController(req, res) {
  try {
    const featuresProduct = await productModel
      .find({ featured: true })
      .populate("category")
      .select("category slug title thumbnail price description");

    if (featuresProduct.length == 0) {
      return res.status(404).json({
        success: false,
        message: "features product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "features product",
      data: featuresProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function searchProductController(req, res) {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(200).json({
        success: true,
        message: "search product",
        data: [],
      });
    }
    const products = await productModel.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });
    return res.status(200).json({
      success: true,
      message: "search product",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  addProductController,
  getProductsController,
  getSingleProductController,
  deleteProductController,
  featuresProductController,
  searchProductController,
};
