import type { Response } from 'express';
import config from '../config';

const cookieOptions = (maxAge: number) => ({
    httpOnly: true,
    secure: false, // local development without https
    sameSite: 'lax' as const,
    maxAge,
    path: '/',
});

export const setAccessTokenCookie = (res: Response, token: string): void => {
    res.cookie('accessToken', token, cookieOptions(config.cookies.accessMaxAge));
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
    res.cookie('refreshToken', token, cookieOptions(config.cookies.refreshMaxAge));
};

export const clearAuthCookies = (res: Response): void => {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
};