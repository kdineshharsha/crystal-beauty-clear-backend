import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    saleType: { type: String, required: true }, // e.g., "flash", "hot", "11.11"
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage",
    },
    discountValue: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        customSalePrice: {
          type: Number,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", saleSchema);
export default Sale;
