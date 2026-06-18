import mongoose from 'mongoose';

// Schema for defining dynamic fields for products
const schemaDefSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'Subcategory', 'Fabric'
  type: { type: String, enum: ['text', 'number', 'boolean', 'imageLink'], required: true },
  label: { type: String, required: true }, // Display name in UI
  required: { type: Boolean, default: false },
  showOnCard: { type: Boolean, default: false }, // Should this appear on Product Card?
  showOnPage: { type: Boolean, default: true },  // Should this appear on Description Page?
  order: { type: Number, default: 0 }, // Sorting order in UI
  createdAt: { type: Date, default: Date.now },
});

const ProductSchemaDef = mongoose.model('ProductSchemaDef', schemaDefSchema);
export default ProductSchemaDef;
