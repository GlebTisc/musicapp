import type { Response } from 'express';
import config from '../config';

export const cookieOptions = {
    httpOnly: true,
    secure: false, // local development without https
    sameSite: 'lax' as const,
    path: '/',
};

const cookieOptionsWithAge = (maxAge: number) => ({
    ...cookieOptions,
    maxAge
});

export const setAccessTokenCookie = (res: Response, token: string): void => {
    res.cookie('accessToken', token, cookieOptionsWithAge(config.cookies.accessMaxAge));
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
    res.cookie('refreshToken', token, cookieOptionsWithAge(config.cookies.refreshMaxAge));
};

export const clearAuthCookies = (res: Response): void => {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
};