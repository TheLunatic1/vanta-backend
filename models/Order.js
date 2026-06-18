import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ 
    productID: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 }
  }],
  totalAmount: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Completed' },
  notes: { type: String }, // Admin notes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
