import express from "express";
import { createSale, getActiveSales } from "../controllers/saleController.js";

const saleRouter = express.Router();

saleRouter.post("/", createSale); // existing create sale route

saleRouter.get("/active", getActiveSales);
export default saleRouter;
