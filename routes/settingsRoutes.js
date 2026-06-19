import express from 'express';
import StoreSettings from '../models/StoreSettings.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get store settings
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({
        trustSignals: [
          { text: 'FREE SHIPPING OVER ৳3000', icon: 'Truck' },
          { text: '15 DAYS EASY RETURN', icon: 'ShieldCheck' }
        ]
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = new StoreSettings();
    }
    
    settings.trustSignals = req.body.trustSignals || settings.trustSignals;
    
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
