import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/newsmania';

export async function connectDatabase(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI);
    console.log('[DATABASE] MongoDB connection established successfully.');
  } catch (error) {
    console.error('[DATABASE] Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('[DATABASE] MongoDB connection closed.');
  } catch (error) {
    console.error('[DATABASE] Error during MongoDB disconnect:', error);
  }
}
