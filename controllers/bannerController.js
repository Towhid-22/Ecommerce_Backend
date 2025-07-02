const bannerOneModel = require("../model/bannerOneModel");
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


module.exports = {
  addBannerOneController,
  getBannerOneController,
};
