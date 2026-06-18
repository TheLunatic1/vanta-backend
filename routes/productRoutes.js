import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

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

// CREATE a new product (admin use)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { productID, title, description, price, salePrice, images, category, subcategory, colors, sizes, stock, variants, sku, status, customFields } = req.body;

    const productExists = await Product.findOne({ productID });
    if (productExists) return res.status(400).json({ message: 'Product ID already exists' });

    const product = new Product({
      productID, title, description, price, salePrice, images, category, subcategory, colors, sizes, stock, variants, sku, status, customFields
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE product (admin use)
router.put('/:productID', protect, admin, async (req, res) => {
  try {
    const product = await Product.findOne({ productID: req.params.productID });

    if (product) {
      product.title = req.body.title || product.title;
      product.description = req.body.description || product.description;
      product.price = req.body.price !== undefined ? req.body.price : product.price;
      product.salePrice = req.body.salePrice !== undefined ? req.body.salePrice : product.salePrice;
      product.images = req.body.images || product.images;
      product.category = req.body.category || product.category;
      product.subcategory = req.body.subcategory || product.subcategory;
      product.colors = req.body.colors || product.colors;
      product.sizes = req.body.sizes || product.sizes;
      product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
      product.variants = req.body.variants || product.variants;
      product.sku = req.body.sku || product.sku;
      product.status = req.body.status || product.status;
      product.customFields = req.body.customFields || product.customFields;
      product.updatedAt = Date.now();

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE product (admin use)
router.delete('/:productID', protect, admin, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ productID: req.params.productID });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;