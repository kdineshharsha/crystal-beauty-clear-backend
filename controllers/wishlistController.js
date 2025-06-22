import Wishlist from "../models/wishlist.js";

// Add to wishlist
export async function addToWishlist(req, res) {
  const { productId } = req.body;
  const userEmail = req.user.email;

  try {
    const exists = await Wishlist.findOne({ userEmail, productId });
    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const item = new Wishlist({ userEmail, productId });
    await item.save();

    res.json({ message: "Added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
}

// Get user wishlist
export async function getWishlist(req, res) {
  const userEmail = req.user.email;

  try {
    console.log("userEmail", userEmail);
    const wishlist = await Wishlist.find({ userEmail });
    res.json(wishlist);
    console.log("Wishlist fetched successfully", wishlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
}

// Remove from wishlist
export async function removeFromWishlist(req, res) {
  const { wishlistId } = req.params;
  const userEmail = req.user.email;

  try {
    const deleted = await Wishlist.findOneAndDelete({
      _id: wishlistId,
      userEmail,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove item" });
  }
}
