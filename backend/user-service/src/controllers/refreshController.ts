import type { Request, Response } from 'express';
import * as refreshTokenService from '../services/refreshTokenService';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../utils/cookies';

export const refresh = catchAsync(async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies?.refreshToken;

    // check if refresh token is provided
    if (!oldRefreshToken) {
        throw new AppError('Refresh token not provided', 401, 'AuthenticationError');
    }

    // refresh tokens
    const { accessToken, refreshToken } = await refreshTokenService.refreshAccessToken(
        oldRefreshToken
    );

    // set cookies for tokens
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({ status: 'success', data: { refreshed: true } });
});