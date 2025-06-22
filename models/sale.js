import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    saleType: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      required: true, // e.g. 20 for 20% or 100 for flat ₹100
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", saleSchema);
export default Sale;
