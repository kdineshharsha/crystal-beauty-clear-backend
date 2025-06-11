import express from "express";
import { createReview } from "../controllers/reviewController.js";
import { getReviewsByProductId } from "../controllers/reviewController.js";
import { deleteReview } from "../controllers/reviewController.js";
import { avarageRating } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// reviewRouter.post("/", createComment); // Add comment
reviewRouter.post("/", createReview); // Add comment
reviewRouter.get("/:productId", getReviewsByProductId); // Get comments for product
reviewRouter.get("/rating/:productId", avarageRating); // Get comments for product
reviewRouter.delete("/:id", deleteReview); // Delete comment by ID

export default reviewRouter;
