const cartModel = require("../model/cartModel");

async function addToCartController(req, res) {
  try {
    const { variant, quantity, user, product, price } = req.body;
    const addtocart = new cartModel({
      variant,
      quantity,
      user,
      product,
      price,
    });
    await addtocart.save();
    return res.status(200).json({
      success: true,
      message: "product added to cart successfully",
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
    const { id } = req.params;
    const fetchcart = await cartModel
      .find({ user: id })
      .populate("product variant");

    if (fetchcart.length == 0) {
      return res.status(200).json({
        success: true,
        message: "cart is empty",
      });
    } else {
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

async function deleteCartController(req, res) {
  try {
    const { id } = req.params;
    const cart = await cartModel.findByIdAndDelete(id);
    // res.send(cart);
    if (req.user.id == cart.user) {
      await cartModel.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "cart delete successfull",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "you do not have permission to delete other user cart",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

async function updateCartController(req, res) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cart = await cartModel.findById(id).populate("product");
    console.log(cart);
    // return;
    if (req.user.id == cart.user) {
      let cartUpdate = await cartModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            quantity,
            price: cart.product.price,
            totalPrice: cart.product.price * quantity,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "quantity update successfull",
        data: cartUpdate,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "you can only update your cart",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
}

async function cartTotalController(req, res) {
  try {
    const { totalPrice } = req.params;
    // Find all cart items for the logged-in user
    const cartItems = await cartModel
      .find({ totalPrice })
      .populate("product variant");

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({ subtotal: 0, items: [] });
    }

    const subtotal = cartItems.reduce((total, item) => {
      let price = 0;

      // If variant has price, use it, else use product price
      if (item.variant && item.variant.price) {
        price = item.variant.price;
      } else if (item.product && item.product.price) {
        price = item.product.price;
      }

      return total + price * item.quantity;
    }, 0);

    res.status(200).json({
      subtotal,
      items: cartItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  addToCartController,
  getCartController,
  deleteCartController,
  updateCartController,
  cartTotalController,
};
