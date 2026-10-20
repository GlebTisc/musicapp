import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import config from '../config';

const generateRefreshTokenValue = () => crypto.randomBytes(40).toString('hex');
const generateFamily = () => crypto.randomBytes(20).toString('hex');

/**
 * Create access + refresh tokens
 * 
 * @param userId
 * @returns 
 */
export const createTokenPair = async (userId: string) => {
    const accessToken = jwt.sign(
        { id: userId },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpiresIn }
    );

    const refreshTokenValue = generateRefreshTokenValue();
    const family = generateFamily();

    const sessionExpiresAt = new Date(Date.now() + config.cookies.refreshMaxAge);

    await RefreshToken.create({
        token: refreshTokenValue,
        userId,
        family,
        isRevoked: false,
        sessionExpiresAt,
    });

    return { accessToken, refreshToken: refreshTokenValue };
};

/**
 * Refresh access and JWT tokens
 * 
 * @param oldRefreshToken 
 * @returns 
 */
export const refreshAccessToken = async (oldRefreshToken: string) => {
    const storedToken = await RefreshToken.findOne({ token: oldRefreshToken });

    // check if token exists
    if (!storedToken) {
        throw new AppError('Invalid refresh token', 401, 'Authentication Error');
    }

    // check if token is revoked
    if (storedToken.isRevoked) {
        // remove all tokens of the family (probably token was stolen)
        await RefreshToken.updateMany(
            { family: storedToken.family },
            { isRevoked: true, revokedAt: new Date() }
        );
        throw new AppError(
            'Refresh token reuse detected. All sessions revoked.',
            401,
            'Authentication Error'
        );
    }

    // check if session expired
    if (storedToken.sessionExpiresAt < new Date()) {
        await RefreshToken.deleteMany({ family: storedToken.family });
        throw new AppError(
            'Session expired. Please login again.',
            401,
            'Authentication Error'
        );
    }

    // check if user exists
    const user = await User.findById(storedToken.userId);
    if (!user) {
        await RefreshToken.deleteMany({ family: storedToken.family });
        throw new AppError('User not found', 401, 'Authentication Error');
    }

    // revoke the old token
    storedToken.isRevoked = true;
    storedToken.revokedAt = new Date();
    await storedToken.save();

    // create new JWT token
    const accessToken = jwt.sign(
        { id: user._id.toString() },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpiresIn }
    );

    // create new refresh token
    const newRefreshToken = generateRefreshTokenValue();

    await RefreshToken.create({
        token: newRefreshToken,
        userId: user._id,
        family: storedToken.family,
        isRevoked: false,
        sessionExpiresAt: storedToken.sessionExpiresAt,
    });

    return { accessToken, refreshToken: newRefreshToken };
};

/**
 * Remove all refresh tokens of the family
 * 
 * @param token
 */
export const revokeRefreshToken = async (token: string) => {
    const storedToken = await RefreshToken.findOne({ token });
    if (storedToken) {
        await RefreshToken.deleteMany({ family: storedToken.family });
    }
};

/**
 * Remove all tokens of the user
 * 
 * @param userId
 */
export const revokeAllUserTokens = async (userId: string) => {
    await RefreshToken.deleteMany({ userId });
};