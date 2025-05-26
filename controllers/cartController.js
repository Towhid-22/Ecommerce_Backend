const cartModel = require("../model/cartModel");

async function addToCartController(req, res) {
  try {
    const { product, user, quantity, variant } = req.body;
    const addtocart = new cartModel({
      product,
      user,
      quantity,
      variant,
    });
    await addtocart.save();
    return res.status(200).json({
      success: true,
      message: "product added to cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

async function getCartController(req, res) {
  try {
    const {id} = req.params;
    const fetchcart = await cartModel.find({user:id}).populate("product variant user");
    if(fetchcart.length == 0){
      return res.status(404).json({
        success: false,
        message: "cart is empty",
      });
    }else{
      return res.status(200).json({
        success: true,
        message: "fetch cart successfull",
        data: fetchcart,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
    
  }
}

module.exports = { addToCartController, getCartController };
