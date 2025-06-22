import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
