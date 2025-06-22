import express from "express";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProductById,
  searchProducts,
  // getProductByCategory,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
// productRouter.get("/:category", getProductByCategory);

productRouter.get("/search/:id", searchProducts);
productRouter.get("/:productId", getProductById);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct);

export default productRouter;
