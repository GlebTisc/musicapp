import mongoose from 'mongoose';
import config from './index';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.mongo.uri);
        logger.info('MongoDB connected');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;