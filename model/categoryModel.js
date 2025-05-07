const { default: mongoose } = require("mongoose");

const categoryModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    maxlength: [50, "Username must be less than 50 characters"],
    minlength: [3, "Username must be more than 3 characters"],
    trim: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Category", categoryModel);
