import express from "express";
import {
  getSubscribers,
  sendNewsLetter,
  subscribe,
} from "../controllers/subscribeController.js";

const subscribeRouter = express.Router();

subscribeRouter.post("/", subscribe);
subscribeRouter.get("/", getSubscribers);
subscribeRouter.post("/send", sendNewsLetter);

export default subscribeRouter;
