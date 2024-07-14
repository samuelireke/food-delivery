import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  fetchUserOrders,
  listOrders,
  placeOrder,
  updateStatus,
  verifyOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, fetchUserOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);

export default orderRouter;
