import express from "express";
import {
  cancelOrder,
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
orderRouter.put("/cancel/:orderId", cancelOrder);
orderRouter.get("/notifications/:userEmail", orderNotification);
orderRouter.delete("/notifications/clear/:email", clearAllNotifications);

export default orderRouter;
