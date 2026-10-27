import type { Request, Response } from 'express';
import * as authService from '../services/authService';
import { catchAsync } from '../utils/catchAsync';
import { getValidated } from '../middleware/validate';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../utils/cookies';
import { AuthenticationError } from '../utils/errors';
import type { LoginDTO, RegisterDTO } from '../services/authService';

/**
 * Register user
 */
export const register = catchAsync(
    async (req: Request, res: Response) => {
        const validatedData = getValidated<RegisterDTO>(req);
        const { user, accessToken, refreshToken } = await authService.register(validatedData);
        setAccessTokenCookie(res, accessToken);
        setRefreshTokenCookie(res, refreshToken);
        res.status(201).json({ status: 'success', data: user });
    }
);

/**
 * Login user
 */
export const login = catchAsync(
    async (req: Request, res: Response) => {
        const validatedData = getValidated<LoginDTO>(req);
        const { user, accessToken, refreshToken } = await authService.login(validatedData);
        setAccessTokenCookie(res, accessToken);
        setRefreshTokenCookie(res, refreshToken);
        res.status(200).json({ status: 'success', data: user });
    }
);

/**
 * Validate access token
 */
export const validate = catchAsync(
    async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError("Access token is not provided");
        }

        const accessToken = authHeader.split(' ')[1];
        const user = await authService.validateAccessToken(accessToken);

        res.status(200).json({ status: 'success', data: user });
    }
);