import express from "express";
import {
  createPromotion,
  getPopupPromotion,
  getAllPromotions,
  deletePromotion,
  updatePromotion,
} from "../controllers/popupAdController.js";

const popupAdrouter = express.Router();

popupAdrouter.post("/", createPromotion);
popupAdrouter.get("/popup", getPopupPromotion); // ✅ For first-time load
popupAdrouter.get("/", getAllPromotions);
popupAdrouter.put("/:id", updatePromotion);
popupAdrouter.delete("/:id", deletePromotion);

export default popupAdrouter;
