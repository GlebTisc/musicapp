import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken';
import User from '../models/User';
import config from '../config';
import { AuthenticationError } from '../utils/errors';
import { SignJWT } from 'jose';
import { getPrivateKey } from 'src/utils/keys';

const generateRefreshTokenValue = () => crypto.randomBytes(40).toString('hex');
const generateFamily = () => crypto.randomBytes(20).toString('hex');

/**
 * Create access + refresh tokens
 * 
 * @param userId
 * @returns 
 */
export const createTokenPair = async (userId: string, role: 'admin' | 'user') => {
    const key = await getPrivateKey();
    
    const accessToken = await new SignJWT({ id: userId, role: role })
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime(config.jwt.accessExpiresIn)
        .sign(key)
    ;

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
        throw new AuthenticationError("Invalid refresh token");
    }

    // check if token is revoked
    if (storedToken.isRevoked) {
        // remove all tokens of the family (probably token was stolen)
        await RefreshToken.updateMany(
            { family: storedToken.family },
            { isRevoked: true, revokedAt: new Date() }
        );
        throw new AuthenticationError("Refresh token reuse detected. All sessions revoked");
    }

    // check if session expired
    if (storedToken.sessionExpiresAt < new Date()) {
        await RefreshToken.deleteMany({ family: storedToken.family });
        throw new AuthenticationError("Session expired. Please login again");
    }

    // check if user exists
    const user = await User.findById(storedToken.userId);
    if (!user) {
        await RefreshToken.deleteMany({ family: storedToken.family });
        throw new AuthenticationError("User not found");
    }

    // revoke the old token
    storedToken.isRevoked = true;
    storedToken.revokedAt = new Date();
    await storedToken.save();

    const key = await getPrivateKey();
    // create new JWT token
    const accessToken = await new SignJWT({ id: user._id.toString(), role: user.role })
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setExpirationTime(config.jwt.accessExpiresIn)
        .sign(key)
    ;

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