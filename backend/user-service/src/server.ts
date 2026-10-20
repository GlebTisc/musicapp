import app from './app';
import config from './config';
import connectDB from './config/database';
import logger from './utils/logger';

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(config.port, '0.0.0.0', () => {
            logger.info(`User Service running on port ${config.port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();