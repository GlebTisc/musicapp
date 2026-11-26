import type { Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { isTokenPayload } from "../utils/typeguards";
import { jwtVerify } from 'jose';
import { getPublicKey } from 'src/utils/keys';
import User from '../models/User';
import { AuthenticationError, TokenExpiredError } from 'src/utils/errors';

export const authenticate = catchAsync(
    async (req, _res: Response, next: NextFunction) => {
        const accessToken = req.cookies?.accessToken;

        // check if bearer token exists
        if (!accessToken) {
            throw new AuthenticationError('You are not logged in!');
        }

        const key = await getPublicKey();
        const { payload } = await jwtVerify(accessToken, key, { algorithms: ['RS256'] });

        // check the type of decoded tocken
        if (!isTokenPayload(payload)) {
            throw new TokenExpiredError('Invalid token payload');
        }

        const currentUser = await User.findById(payload.id);

        // if user's not found - throw an error
        if (!currentUser) {
            throw new AuthenticationError('User no longer exists');
        }

        req.user = {
            _id: currentUser._id.toString(),
            username: currentUser.username,
            email: currentUser.email,
            role: currentUser.role,
        };

        next();
    }
);