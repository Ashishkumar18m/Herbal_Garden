// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'webd_project';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve frontend files

// ---------------- MongoDB Connection ----------------
let db;
let productsCol;
let reviewsCol;

async function connectDB() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  productsCol = db.collection('products');
  reviewsCol = db.collection('reviews');
  console.log('Connected to MongoDB:', MONGO_URI, 'db:', DB_NAME);
}
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// ---------------- OOP example class ----------------
class Product {
  constructor({_id, id, name, image, price, previous_price, description, category, rating}) {
    this._id = _id;
    this.id = id || null;
    this.name = name;
    this.image = image;
    this.price = price;
    this.previous_price = previous_price;
    this.description = description || '';
    this.category = category || 'uncategorized';
    this.rating = rating || { stars: 0, review: 0 };
  }

  getDiscountedPrice(percent) {
    if (!this.price) return null;
    const p = Number(this.price);
    return Number((p - (p * percent / 100)).toFixed(2));
  }
}

// ---------------- API routes ----------------

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

/* ---------------- PRODUCTS CRUD -------------------- */

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    const result = await productsCol.insertOne(product);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Read all products
app.get('/api/products', async (req, res) => {
  try {
    // optional query params e.g., ?category=herb
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const data = await productsCol.find(filter).toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Read one product by mongo _id or numeric id
app.get('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let product;
    if (ObjectId.isValid(id)) {
      product = await productsCol.findOne({ _id: new ObjectId(id) });
    }
    if (!product) {
      // fallback: numeric id field
      product = await productsCol.findOne({ id: Number(id) });
    }
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// Update product by _id
app.put('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    let result;
    if (ObjectId.isValid(id)) {
      result = await productsCol.updateOne({ _id: new ObjectId(id) }, { $set: body });
    } else {
      result = await productsCol.updateOne({ id: Number(id) }, { $set: body });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product by _id
app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let result;
    if (ObjectId.isValid(id)) {
      result = await productsCol.deleteOne({ _id: new ObjectId(id) });
    } else {
      result = await productsCol.deleteOne({ id: Number(id) });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// OOP example endpoint: get discounted price
app.get('/api/product/:id/discount/:percent', async (req, res) => {
  try {
    const { id, percent } = req.params;
    let productDoc;
    if (ObjectId.isValid(id)) {
      productDoc = await productsCol.findOne({ _id: new ObjectId(id) });
    }
    if (!productDoc) {
      productDoc = await productsCol.findOne({ id: Number(id) });
    }
    if (!productDoc) return res.status(404).json({ error: 'Product not found' });

    const product = new Product(productDoc);
    res.json({
      id: product._id || product.id,
      name: product.name,
      original_price: product.price,
      discounted_price: product.getDiscountedPrice(Number(percent))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute discount' });
  }
});

/* ---------------- REVIEWS CRUD (example extra collection) -------------------- */

// Create review for a product
app.post('/api/reviews', async (req, res) => {
  try {
    const rev = req.body; // { productId: '...', author: '...', rating: 5, text: '...' }
    if (!rev.productId) return res.status(400).json({ error: 'productId required' });
    rev.createdAt = new Date();
    const result = await reviewsCol.insertOne(rev);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Read reviews by productId
app.get('/api/reviews', async (req, res) => {
  try {
    const productId = req.query.productId;
    const filter = {};
    if (productId) filter.productId = productId;
    const data = await reviewsCol.find(filter).toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Update review
app.put('/api/reviews/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const result = await reviewsCol.updateOne({ _id: new ObjectId(id) }, { $set: body });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete review
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await reviewsCol.deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// catch-all to serve index.html for client-side routing if needed
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
