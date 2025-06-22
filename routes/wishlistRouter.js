import express from "express";

import auth from "../middleware/auth.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/", addToWishlist);
wishlistRouter.get("/", getWishlist);
wishlistRouter.delete("/:wishlistId", removeFromWishlist);

export default wishlistRouter;
