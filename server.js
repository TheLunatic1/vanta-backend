import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import schemaRoutes from './routes/schemaRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Database Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('❌ DB Connection Failed:', error.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schema', schemaRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Vanta Backend is running 🚀',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ==================== LOCAL DEVELOPMENT ====================
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
    }
  };

  startServer();
}

export default app;