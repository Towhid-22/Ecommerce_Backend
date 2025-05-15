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
