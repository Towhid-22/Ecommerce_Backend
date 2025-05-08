const categoryModel = require("../model/categoryModel");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");

async function addcategoryController(req, res) {
  let { name, description } = req.body;
  try {
    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });

    let category = new categoryModel({
      name,
      description,
      image: `${process.env.SERVER_URL}/${req.file.filename}`,
      slug,
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
    let allCategories = await categoryModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("subcategory"); // add populate for get subcategory details

    if (allCategories.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "categories not found" });
    }

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

async function singleCategory(req, res) {
  const { slug } = req.params;
  try {
    const slugname = slugify(slug, { lower: true, replacement: "_" });
    const category = await categoryModel.findOne({ slug: slugname });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    }

    return res.status(200).json({
      success: true,
      message: "fetch single category",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
  // res.send(id)
}

async function deletecategory(req, res) {
  const { id } = req.params;
  try {
    const category = await categoryModel.findOneAndDelete({ _id: id });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    }

    const oldpath = path.join(__dirname, "../uploads");
    const fullimagepath = category.image.split("/");
    const imagepath = fullimagepath[fullimagepath.length - 1];

    fs.unlink(`${oldpath}/${imagepath}`, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message || "something went wrong",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "category delete successfull",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

async function updatecategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const { filename } = req.file;

    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });

    if (filename) {
      const oldcategory = await categoryModel.findById(id);
      if (!oldcategory) {
        return res.status(404).json({
          success: false,
          message: "category not found",
        });
      } else {
        const oldpath = path.join(__dirname, "../uploads");
        const fullimagepath = oldcategory.image.split("/");
        const imagepath = fullimagepath[fullimagepath.length - 1];
        fs.unlink(`${oldpath}/${imagepath}`, async (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message || "something went wrong",
            });
          } else {
            const updatecategory = await categoryModel.findOneAndUpdate(
              { _id: id },
              {
                image: `${process.env.SERVER_URL}/${filename}`,
                name,
                description,

                slug,
              },
              { new: true }
            );
            return res.status(200).json({
              success: true,
              message: "category updated successfully",
              data: updatecategory,
            });
          }
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

module.exports = {
  addcategoryController,
  getAllCategories,
  singleCategory,
  deletecategory,
  updatecategory,
};
