const bannerOneModel = require("../model/bannerOneModel");
const path = require("path");
const fs = require("fs");
async function addBannerOneController(req, res) {
  try {
    const { href } = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Banner image is required" });
    }
    const addBannerOne = new bannerOneModel({
      image: `${process.env.SERVER_URL}/${req.file.filename}`,
      href,
    });
    await addBannerOne.save();
    return res.status(200).json({
      success: true,
      data: addBannerOne,
      message: "Banner added successfull",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getBannerOneController(req, res) {
  try {
    const getBannerOne = await bannerOneModel.find({});
    return res.status(200).json({
      success: true,
      message: "Banner fetch successfull",
      data: getBannerOne,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteBannerOneController(req, res) {
  try {
    const { id } = req.params;
    const deleteBannerOne = await bannerOneModel.findByIdAndDelete(id);

    if (!deleteBannerOne) {
      return res.status(404).json({
        success: false,
        message: "banner not found",
      });
    } else {
      const oldpath = path.join(__dirname, "../uploads");
      const fullimagepath = deleteBannerOne.image?.split("/");
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
            message: "banner delete successfull",
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

module.exports = {
  addBannerOneController,
  getBannerOneController,
  deleteBannerOneController,
};
