// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productID: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  images: [{ type: String }],
  
  category: { 
    type: String, 
    enum: ['Men', 'Women', 'Others'], 
    required: true 
  },
  
  subcategory: { type: String },
  colors: { type: String },
  sizes: { type: String },
  
  stock: { 
    type: Number, 
    default: 0 
  },   // ← New Stock Field
  
  variants: { type: String },
  sku: { type: String },
  status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
export default Product;