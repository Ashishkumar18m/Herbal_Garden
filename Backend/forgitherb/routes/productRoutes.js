import express from 'express';
import Product from "../models/Product.js";

import { getProducts, getProductById, createProduct } from '../controllers/productController.js';

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET product by ID
router.get('/:id', getProductById);

// POST create new product
router.post('/', createProduct);

export default router;
