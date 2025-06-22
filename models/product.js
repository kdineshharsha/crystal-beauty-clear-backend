import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  altNames: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  labeledPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: [String],
    required: true,
    default: [
      "https://media.istockphoto.com/id/1319770522/photo/empty-product-stand-podium-pedestal-exhibition-with-palm-trees-and-neon-lights-on-dark.webp?b=1&s=612x612&w=0&k=20&c=SXUmpk480KsmVrBdFO6ASrHXU2MLoqgtVWhIqfrmVQY=",
    ],
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true, // set to false if it's optional
    enum: ["lips", "eye", "face", "nail", "skincare", "fragrance"], // example categories
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
