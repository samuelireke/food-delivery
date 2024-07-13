import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = process.env.CLIENT_URL;

// placing user order for frontend
const placeOrder = async (req, res) => {
  const { userId, items, amount, address } = req.body;
  try {
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cart: {} });

    // create stripe payment link
    const line_items = items.map((item) => ({
      price: {
        currency: "gbp",
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price: {
        currency: "gbp",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${CLIENT_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${CLIENT_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occured while processing order",
    });
  }
};

export { placeOrder };
