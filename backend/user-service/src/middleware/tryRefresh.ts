import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken';
import User from '../models/User';
import config from '../config';
import { setAccessTokenCookie } from '../utils/cookies';

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
        const storedRefresh = await RefreshToken.findOne({
            token: refreshToken,
            isRevoked: false,
        });

        if (!storedRefresh) return next();

        // check if session is expired
        if (storedRefresh.sessionExpiresAt < new Date()) {
            await RefreshToken.deleteMany({ family: storedRefresh.family });
            return next();
        }

        const user = await User.findById(storedRefresh.userId);
        if (!user) return next();

        // generate new access token
        const newAccessToken = jwt.sign(
            { id: user._id.toString() },
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