import express from "express";
import {
  createBanner,
  deleteBanner,
  getBanners,
  getActiveBanners,
  updateBanner,
} from "../controllers/bannerController.js";

const bannerRouter = express.Router();

// Admin Routes
bannerRouter.post("/", createBanner);
bannerRouter.get("/", getBanners); // Includes expired banners with status
bannerRouter.put("/:id", updateBanner);
bannerRouter.delete("/:id", deleteBanner);

// Public Route
bannerRouter.get("/active", getActiveBanners); // Only non-expired visible banners

export default bannerRouter;
