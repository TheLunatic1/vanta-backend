import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Admin health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Vanta Backend Admin Healthy',
    timestamp: new Date().toISOString()
  });
});

// Get total products count
router.get('/stats', async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const men = await Product.countDocuments({ category: 'Men' });
    const women = await Product.countDocuments({ category: 'Women' });
    res.json({ total, men, women });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;