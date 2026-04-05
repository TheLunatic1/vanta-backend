import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { status: 'Active' };

    if (category) {
      query.category = category; // Men or Women
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single product
router.get('/:productID', async (req, res) => {
  try {
    const product = await Product.findOne({ productID: req.params.productID });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE product (admin use)
router.delete('/:productID', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ productID: req.params.productID });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;