import Review from "../models/review.js";

// Create a new comment

export async function createReview(req, res) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Please login to create a review" });
    }
    const userName = req.user.firstName + " " + req.user.lastName;
    const review = {
      productId: req.body.productId,
      userId: req.user.email,
      username: userName,
      text: req.body.text,
      rating: req.body.rating,
    };
    console.log("Review data:", userName);
    const newReview = new Review(review);
    await newReview.save();

    console.log("Review:", review);
    res.json({ message: "Review created successfully", review });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getReviewsByProductId(req, res) {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteReview(req, res) {
  try {
    const reviewId = req.params.id;
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function avarageRating(req, res) {
  try {
    const productId = req.params.productId;
    const reviews = await Review.find({ productId });

    if (reviews.length === 0) {
      return res.json({ averageRating: 0 });
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    res.json({ averageRating: averageRating.toFixed(2) });
  } catch (err) {
    console.error("Error calculating average rating:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
