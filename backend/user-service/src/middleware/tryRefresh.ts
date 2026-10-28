import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken';
import User from '../models/User';
import config from '../config';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../utils/cookies';

/**
 * An attempt to refresh JWT access token
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const tryRefresh = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) return next();

    try {
        jwt.verify(accessToken, config.jwt.secret);
        return next();
    } catch (error: any) {
        if (error.name !== 'TokenExpiredError') return next();
    }

    // access token is expired, check refresh token
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return next();

    try {
        const storedRefresh = await RefreshToken.findOne({token: refreshToken});

        if (!storedRefresh) return next();

        // token is compromised
        if (storedRefresh.isRevoked) {
            // revoke the token's family
            await RefreshToken.updateMany(
                { family: storedRefresh.family },
                { $set: {isRevoked: true} }
            );

            // clear cookies
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return next();
        }

        // check if session is expired
        if (storedRefresh.sessionExpiresAt < new Date()) {
            await await RefreshToken.updateMany(
                { family: storedRefresh.family },
                { $set: {isRevoked: true} }
            );
            return next();
        }

        const user = await User.findById(storedRefresh.userId);
        if (!user) return next();

        // rotate the token
        storedRefresh.isRevoked = true;
        await storedRefresh.save();

        const newRefreshToken = crypto.randomBytes(40).toString('hex');

        // save new refresh token with the old family
        await RefreshToken.create({
            token: newRefreshToken,
            userId: user._id,
            family: storedRefresh.family,
            sessionExpiresAt: storedRefresh.sessionExpiresAt,
            isRevoked: false,
        });

        setRefreshTokenCookie(res, newRefreshToken);

        // generate new access token
        const newAccessToken = jwt.sign(
            { id: user._id.toString(), role: user.role },
            config.jwt.secret,
            { expiresIn: config.jwt.accessExpiresIn }
        );

        // update cookie for the access token
        setAccessTokenCookie(res, newAccessToken);
        req.cookies.accessToken = newAccessToken;

        next();
    } catch {
        next();
    }
};