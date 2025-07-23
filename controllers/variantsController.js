const { default: slugify } = require("slugify");
const productModel = require("../model/productModel");
const variantModel = require("../model/variantModel");
const path = require("path");
const fs = require("fs");

async function add_variantController(req, res) {
  try {
    const { product, color, size, stock } = req.body;

    const variant = new variantModel({
      product,
      color,
      size,
      stock,
      image: req.file && `${process.env.SERVER_URL}/${req.file.filename}`,
    });
    await variant.save();

    const productupdate = await productModel.findOneAndUpdate(
      { _id: product },
      { $push: { variant: variant._id } },
      { new: true }
    );

    await productupdate.save();

    const basesku = slugify(productupdate.title.slice(0, 3), {
      lower: true,
      replacement: "_",
    });

    const colorPort = color ? `-${slugify(color, { lower: true })}` : "";
    const sizePort = size ? `-${slugify(size, { lower: true })}` : "";
    const sku = `${basesku}${colorPort}${sizePort}-${
      Math.round(Math.random()) + 10
    }`;

    await variantModel.findOneAndUpdate(
      { _id: variant._id },
      { $set: { sku } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Variant added successfully",
      variant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

async function delete_variantController(req, res) {
  try {
    const { id } = req.params;
    const variant = await variantModel.findOneAndDelete({ _id: id });

    if (!variant) {
      return res
        .status(404)
        .json({ success: false, message: "variant not found" });
    } else {
      if (variant.image) {
        const oldpath = path.join(__dirname, "../uploads");
        const fullimagepath = variant.image.split("/");
        const imagepath = fullimagepath[fullimagepath.length - 1];

        fs.unlink(`${oldpath}/${imagepath}`, (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message || "something went wrong",
            });
          } else {
            // const productupdate = productModel.findOneAndUpdate(
            //   { variant: id },
            //   { $pull: { variant: id } },
            //   { new: true }
            // );
            // productupdate.save();
            return res.status(200).json({
              success: true,
              message: "variant delete successfull",
            });
          }
        });
      } else {
        // const productupdate = productModel.findOneAndUpdate(
        //   { variant: id },
        //   { $pull: { variant: id } },
        //   { new: true }
        // );
        // productupdate.save();
        return res.status(200).json({
          success: true,
          message: "variant delete successfull",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function update_variantController(req, res) {
  try {
    const { id } = req.params;
    const { color, size, stock } = req.body;

    if (req.file?.filename) {
      const oldvariant = await variantModel.findById(id);
      if (!oldvariant) {
        return res.status(404).json({
          success: false,
          message: "variant not found",
        });
      } else {
        if (oldvariant.image) {
          const oldpath = path.join(__dirname, "../uploads");
          const fullimagepath = oldvariant.image.split("/");
          const imagepath = fullimagepath[fullimagepath.length - 1];
          fs.unlink(`${oldpath}/${imagepath}`, async (err) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message || "something went wrong",
              });
            }
          });
        } else {
          const updatevariant = await variantModel.findOneAndUpdate(
            { _id: id },
            {
              image: `${process.env.SERVER_URL}/${req.file.filename}`,
              color,
              size,
              stock,
            },
            { new: true }
          );
          return res.status(200).json({
            success: true,
            message: "variant updated successfully",
            data: updatevariant,
          });
        }
      }
    } else {
      const updatevariant = await variantModel.findOneAndUpdate(
        { _id: id },
        {
          color,
          size,
          stock,
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "variant updated successfully",
        data: updatevariant,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  add_variantController,
  delete_variantController,
  update_variantController,
};
