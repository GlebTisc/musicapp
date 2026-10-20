import type { Response } from 'express';
import * as authService from '../services/authService';
import { catchAsync } from '../utils/catchAsync';
import { getValidated } from '../middleware/validate';
import type { RegisterDTO, LoginDTO } from '../services/authService';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../utils/cookies';

export const register = catchAsync(
    async (req, res: Response) => {
        const validatedData = getValidated<RegisterDTO>(req);
        const { user, accessToken, refreshToken } = await authService.register(validatedData);
        setAccessTokenCookie(res, accessToken);
        setRefreshTokenCookie(res, refreshToken);
        res.status(201).json({ status: 'success', data: user });
    }
);

export const login = catchAsync(
    async (req, res: Response) => {
        const validatedData = getValidated<LoginDTO>(req);
        const { user, accessToken, refreshToken } = await authService.login(validatedData);
        setAccessTokenCookie(res, accessToken);
        setRefreshTokenCookie(res, refreshToken);
        res.status(200).json({ status: 'success', data: user });
    }
);