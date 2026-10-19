import dotenv from 'dotenv';
dotenv.config();

export default {
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    mongo: {
        uri: process.env.MONGO_URI || 'mongodb://root:root@mongodb:27017/users_db?authSource=admin'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'key-that-should-be-changed',
        expiresIn: process.env.JWT_EXPIRE || '1d'
    },
    cors: {
        allowedOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173']
    }
}