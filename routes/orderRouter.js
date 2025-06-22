import express from "express";
import {
  clearAllNotifications,
  createOrder,
  getOrder,
  getOrdersByUserEmail,
  orderNotification,
  updateOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrder);
orderRouter.put("/:orderId", updateOrder);
orderRouter.get("/:userEmail", getOrdersByUserEmail);
orderRouter.get("/notifications/:userEmail", orderNotification);
orderRouter.delete("/notifications/clear/:email", clearAllNotifications);

export default orderRouter;
