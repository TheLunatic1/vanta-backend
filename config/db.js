import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  // If already connected, reuse it
  if (isConnected) {
    console.log('✅ MongoDB already connected (reused)');
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 20000,
      bufferCommands: false,        // Important for Vercel
    });

    isConnected = true;
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

export default connectDB;