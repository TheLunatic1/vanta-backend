import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import syncRoutes from './routes/syncRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: '*',                    // Change to your frontend URL later
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// DB Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB Connection Failed:', error.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Vanta Backend is running 🚀',
    environment: process.env.NODE_ENV || 'production'
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;