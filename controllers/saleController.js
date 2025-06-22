import Product from "../models/product.js";
import Sale from "../models/sale.js";

export const createSale = async (req, res) => {
  try {
    const {
      title,
      saleType,
      discountType,
      discountValue,
      startDate,
      endDate,
      productIds,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !saleType ||
      !discountValue ||
      !startDate ||
      !endDate ||
      !Array.isArray(productIds) ||
      productIds.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate product IDs
    const validProducts = await Product.find({
      _id: { $in: productIds },
    });

    if (validProducts.length !== productIds.length) {
      return res
        .status(404)
        .json({ message: "Some product IDs are invalid or not found" });
    }

    // Create the sale
    const sale = new Sale({
      title,
      saleType,
      discountType,
      discountValue,
      startDate,
      endDate,
      products: productIds,
    });

    await sale.save();

    res.status(201).json({ message: "Sale created successfully", sale });
  } catch (err) {
    console.error("Error creating sale:", err);
    res.status(500).json({ message: "Server error while creating sale" });
  }
};
