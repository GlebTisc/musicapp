import dotenv from 'dotenv';
import { SignOptions } from "jsonwebtoken";

dotenv.config();

const DEFAULT_REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

export default {
    port: parseInt(process.env.PORT || '3000'),

    // configuration for mongoDb connection
    mongo: {
        uri: process.env.MONGO_URI || 'mongodb://root:root@mongodb:27017/users_db?authSource=admin'
    },

    // JWT token secret + expiration configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'key-that-should-be-changed',
        accessExpiresIn: (process.env.JWT_ACCESS_EXPIRE || '2d') as SignOptions['expiresIn'],
        refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRE || '14d') as SignOptions['expiresIn']
    },

    // CORS
    cors: {
        allowedOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173']
    },

    // cookies configuration
    cookies: {
        accessMaxAge: 24 * 60 * 60 * 1000, // 1 day in ms
        refreshMaxAge: DEFAULT_REFRESH_MAX_AGE_MS,
        // refresh token time to live (refresh token age + 3 days), after its expitation it will be removed from db
        refreshTokenTTL: DEFAULT_REFRESH_MAX_AGE_MS + 3 * 24 * 60 * 60 * 1000
    }
}