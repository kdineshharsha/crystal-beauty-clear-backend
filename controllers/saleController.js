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
      products,
    } = req.body;

    // Validations
    if (
      !title ||
      !saleType ||
      !discountType ||
      !discountValue ||
      !startDate ||
      !endDate ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate each product entry
    const productIds = products.map((p) => p.product);
    const validProducts = await Product.find({ _id: { $in: productIds } });
    if (validProducts.length !== products.length) {
      return res
        .status(404)
        .json({ message: "One or more product IDs invalid" });
    }

    // Create the sale
    const newSale = new Sale({
      title,
      saleType,
      discountType,
      discountValue,
      startDate,
      endDate,
      products,
    });

    await newSale.save();

    res
      .status(201)
      .json({ message: "Sale created successfully", sale: newSale });
  } catch (err) {
    console.error("Error creating sale:", err);
    res.status(500).json({ message: "Server error while creating sale" });
  }
};

export const getActiveSales = async (req, res) => {
  try {
    const now = new Date();

    const sales = await Sale.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).populate("products.product");

    res.json(sales);
  } catch (err) {
    console.error("Get Active Sales Error:", err);
    res.status(500).json({ message: "Error fetching active sales" });
  }
};
