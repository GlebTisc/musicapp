import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import logger from '../utils/logger';

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // if error is handled - return it
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.error,
            message: err.message,
            status: err.statusCode,
            ...(err.details !== undefined && { details: err.details }),
        });
        return;
    }

    // token expiration error
    if (err instanceof TokenExpiredError) {
        res.status(401).json({
            error: 'Token Expired Error',
            message: 'Access token expired',
            status: 401,
        });
        return;
    }

    // invalid token error
    if (err instanceof JsonWebTokenError) {
        res.status(401).json({
            error: 'Authentication Error',
            message: 'Invalid access token',
            status: 401,
        });
        return;
    }

    // unknown exception
    logger.error('Unhandled Error:', err);

    res.status(500).json({
        error: 'Internal Error: ' + err.name,
        message: err.message ?? 'Something went wrong',
        status: 500,
    });
};