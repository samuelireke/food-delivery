import userModel from "../models/userModel.js";

//add items to user cart

const addToCart = async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    let user = await userModel.findById(userId);

    let cart = await user.cart;

    if (!cart[itemId]) {
      cart[itemId] = 1;
    } else {
      cart[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cart });

    res.status(200).json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error adding item to cart" });
  }
};

//remove items from user cart
const removeFromCart = async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    let user = await userModel.findById(userId);
    let cart = await user.cart;
    if (cart[itemId] > 0) {
      cart[itemId] -= 1;
      if (cart[itemId] === 0) {
        delete cart[itemId];
      }
    }
    await userModel.findByIdAndUpdate(userId, { cart });
    res.status(200).json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error removing item from cart" });
  }
};

// fetch user cart

const getCart = async (req, res) => {
  const { userId } = req.body;
  try {
    let user = await userModel.findById(userId);
    let cart = await user.cart;

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

export { addToCart, removeFromCart, getCart };
