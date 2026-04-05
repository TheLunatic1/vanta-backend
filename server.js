import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import syncRoutes from './routes/syncRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: '*',   // Change to your frontend URL later
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/sync', syncRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Vanta Backend is running 🚀',
    status: 'healthy',
    autoSync: 'every 2 minutes'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;