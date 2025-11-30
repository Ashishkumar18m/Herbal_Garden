import Product from '../models/Product.js';

// Get all products
export async function getProducts(req, res) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

// Get product by ID
export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

// Create a new product
export async function createProduct(req, res) {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}
