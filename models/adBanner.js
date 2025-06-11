import mongoose from "mongoose";

const adBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: [String],
      required: true,
    },
    link: {
      type: String,
      default: "",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Export the model
const AdBanner = mongoose.model("AdBanner", adBannerSchema);
export default AdBanner;
