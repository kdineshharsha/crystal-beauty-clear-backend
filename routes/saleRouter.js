import express from "express";
import { createSale } from "../controllers/saleController.js";

const saleRouter = express.Router();

// POST /api/sale
saleRouter.post("/", createSale);

export default saleRouter;
