import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: {
      type: [String],
      required: true,
    },
    description: { type: String },
    showAsPopup: { type: Boolean, default: false }, // ✅ Show as popup?
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PopupAd = mongoose.model("PopupAd", promotionSchema);
