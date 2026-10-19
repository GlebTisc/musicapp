import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { isTokenPayload } from "../utils/typeguards";
import User from '../models/User';
import config from '../config';

export const authenticate = catchAsync(
    async (req, _res: Response, next: NextFunction) => {
        const header = req.headers.authorization;

        // check if bearer token exists
        if (!header?.startsWith('Bearer')) {
            throw new AppError('You are not logged in!', 401, 'Authentication error');
        }

        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, config.jwt.secret);

        // check the type of decoded tocken
        if (!isTokenPayload(decoded)) {
            throw new AppError('Invalid token payload', 401, 'AuthenticationError');
        }

        const currentUser = await User.findById(decoded.id);

        // if user's not found - throw an error
        if (!currentUser) {
            throw new AppError('User no longer exists', 401, 'Authentication error');
        }

        req.user = {
            id: currentUser._id.toString(),
            email: currentUser.email,
            role: currentUser.role,
        };

        next();
    }
);