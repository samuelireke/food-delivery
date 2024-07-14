import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  fetchUserOrders,
  placeOrder,
  verifyOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, fetchUserOrders);

export default orderRouter;
