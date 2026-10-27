import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync';
import { isTokenPayload } from "../utils/typeguards";
import User from '../models/User';
import config from '../config';
import { AuthenticationError, TokenExpiredError } from 'src/utils/errors';

export const authenticate = catchAsync(
    async (req, _res: Response, next: NextFunction) => {
        const accessToken = req.cookies?.accessToken;

        // check if bearer token exists
        if (!accessToken) {
            throw new AuthenticationError('You are not logged in!');
        }

        const decoded = jwt.verify(accessToken, config.jwt.secret);

        // check the type of decoded tocken
        if (!isTokenPayload(decoded)) {
            throw new TokenExpiredError('Invalid token payload');
        }

        const currentUser = await User.findById(decoded.id);

        // if user's not found - throw an error
        if (!currentUser) {
            throw new AuthenticationError('User no longer exists');
        }

        req.user = {
            id: currentUser._id.toString(),
            username: currentUser.username,
            email: currentUser.email,
            role: currentUser.role,
        };

        next();
    }
);