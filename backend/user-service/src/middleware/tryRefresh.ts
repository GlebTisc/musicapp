import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import RefreshToken from '../models/RefreshToken';
import User from '../models/User';
import config from '../config';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../utils/cookies';
import { getPrivateKey, getPublicKey } from 'src/utils/keys';
import { jwtVerify, SignJWT } from 'jose';

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
        const key = await getPublicKey();
        await jwtVerify(accessToken, key, { algorithms: ['RS256'] });
        return next();
    } catch (error: any) {
        if (error.code !== 'ERR_JWT_EXPIRED') return next();
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

        const key = await getPrivateKey();
        // generate new access token
        const newAccessToken = await new SignJWT({ id: user._id.toString(), role: user.role })
            .setProtectedHeader({ alg: 'RS256' })
            .setIssuedAt()
            .setExpirationTime(config.jwt.accessExpiresIn)
            .sign(key)
        ;

        // update cookie for the access token
        setAccessTokenCookie(res, newAccessToken);
        req.cookies.accessToken = newAccessToken;

        next();
    } catch {
        next();
    }
};