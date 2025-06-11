import Product from "../models/product.js";

export async function createProduct(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "You need to login first",
    });
    return;
  }
  if (req.user.role != "admin") {
    res.status(403).json({
      message: "You are not authorized to create a product",
    });
    return;
  }
  const product = new Product(req.body);
  try {
    await product.save();
    res.json({
      message: "Product saved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Product not saved",
    });
  }
}

export async function getProducts(req, res) {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Products not found",
    });
  }
}

export async function getProductById(req, res) {
  const productId = req.params.productId;

  const product = await Product.findOne({ productId: productId });

  if (product == null) {
    res.status(404).json({
      message: "Product not found",
    });
    return;
  }
  res.json({
    message: "Product found successfully",
    product: product,
  });
}

export async function deleteProduct(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "You need to login first",
    });
    return;
  }
  if (req.user.role != "admin") {
    res.status(403).json({
      message: "You are not authorized to delete a product",
    });
    return;
  }
  Product.findOneAndDelete({ productId: req.params.productId })
    .then(() => {
      res.json({
        message: "Product deleted successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Product not deleted",
      });
    });
}

export async function updateProduct(req, res) {
  Product.findOneAndUpdate({ productId: req.params.productId }, req.body)
    .then((updatedProduct) => {
      if (updatedProduct == null) {
        res.status(404).json({
          message: "Product not found",
        });
      } else {
        res.json({
          message: "Product updated successfully",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Product not updated",
      });
    });
}

export async function searchProducts(req, res) {
  const searchTerm = req.params.id;

  try {
    const product = await Product.find({
      $or: [
        { productName: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { altNames: { $elemMatch: { $regex: searchTerm, $options: "i" } } },
      ],
    });
    res.status(200).json({
      products: product,
    });
    console.log(product);
    console.log(searchTerm);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Products not found",
    });
  }
}
