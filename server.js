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
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/sync', syncRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Vanta Backend is running 🚀',
    status: 'healthy'
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server + DB + Cron
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`🔄 Auto sync scheduled every 2 minutes`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
  }
};

startServer();