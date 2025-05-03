const { default: mongoose } = require("mongoose");

const categoryModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    maxlength: [20, "Username must be less than 20 characters"],
    minlength: [3, "Username must be more than 3 characters"],
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Category", categoryModel);
