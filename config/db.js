import mongoose from 'mongoose';
import dns from 'dns';

// Force Google DNS to bypass ISP SRV query blocking
dns.setServers(['8.8.8.8', '8.8.4.4']);
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 20000,
      bufferCommands: false,
      family: 4, // Force IPv4 to fix querySrv ECONNREFUSED issues
    });
    isConnected = true;
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

export default connectDB;