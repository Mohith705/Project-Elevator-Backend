import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { autoIndex: true });
    logger.info('✅ MongoDB connected');
};
