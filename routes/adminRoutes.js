import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/auth.js';

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
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue from completed orders
    const orders = await Order.find({ status: 'Completed' });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    const men = await Product.countDocuments({ category: 'Men' });
    const women = await Product.countDocuments({ category: 'Women' });
    res.json({ totalProducts, totalUsers, totalOrders, totalRevenue, men, women });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
