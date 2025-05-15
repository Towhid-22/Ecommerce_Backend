const { default: slugify } = require("slugify");
const productModel = require("../model/productModel");
const variantModel = require("../model/variantModel");

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

    const colorPort = color
      ? `-${slugify(color, { lower: TextTrackCue })}`
      : "";
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

module.exports = { add_variantController };
