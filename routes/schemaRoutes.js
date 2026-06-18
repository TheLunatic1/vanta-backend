import express from 'express';
import ProductSchemaDef from '../models/ProductSchemaDef.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all schema definitions
// @route   GET /api/schema
// @access  Public (Storefront needs this to render)
router.get('/', async (req, res) => {
  try {
    const schemas = await ProductSchemaDef.find({}).sort({ order: 1 });
    res.json(schemas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new schema definition
// @route   POST /api/schema
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, type, label, required, showOnCard, showOnPage, order } = req.body;
    
    const schemaExists = await ProductSchemaDef.findOne({ name });
    if (schemaExists) {
      return res.status(400).json({ message: 'Schema field already exists' });
    }

    const schemaDef = await ProductSchemaDef.create({
      name, type, label, required, showOnCard, showOnPage, order
    });

    res.status(201).json(schemaDef);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a schema definition
// @route   PUT /api/schema/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const schemaDef = await ProductSchemaDef.findById(req.params.id);

    if (schemaDef) {
      schemaDef.name = req.body.name || schemaDef.name;
      schemaDef.type = req.body.type || schemaDef.type;
      schemaDef.label = req.body.label || schemaDef.label;
      schemaDef.required = req.body.required !== undefined ? req.body.required : schemaDef.required;
      schemaDef.showOnCard = req.body.showOnCard !== undefined ? req.body.showOnCard : schemaDef.showOnCard;
      schemaDef.showOnPage = req.body.showOnPage !== undefined ? req.body.showOnPage : schemaDef.showOnPage;
      schemaDef.order = req.body.order !== undefined ? req.body.order : schemaDef.order;

      const updatedSchemaDef = await schemaDef.save();
      res.json(updatedSchemaDef);
    } else {
      res.status(404).json({ message: 'Schema not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a schema definition
// @route   DELETE /api/schema/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const schemaDef = await ProductSchemaDef.findByIdAndDelete(req.params.id);
    if (!schemaDef) {
      return res.status(404).json({ message: 'Schema not found' });
    }
    res.json({ message: 'Schema definition removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
