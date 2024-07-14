import "dotenv/config";
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
      price_data: {
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
      price_data: {
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

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId, { payment: false });
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occured while verifying order",
    });
  }
};

// user orders to be displayed in fronted
const fetchUserOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occured while fetching user orders",
    });
  }
};

// Listing orders for Admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occured while listing orders",
    });
  }
};

// updating order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.status(200).json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occured while updating order status",
    });
  }
};

export { placeOrder, verifyOrder, fetchUserOrders, listOrders, updateStatus };
