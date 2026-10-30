import RefreshToken from "src/models/RefreshToken";
import { catchAsync } from "../utils/catchAsync";
import type { Request, Response } from 'express';
import { cookieOptions } from "src/utils/cookies";
import { getValidatedQuery } from "src/middleware/validate";
import { GetUserDTO } from "src/services/userService";
import * as userService from "../services/userService";

/**
 * Get user info
 */
export const me = catchAsync(
    async (req: Request, res: Response) => {
        res.status(200).json({
            status: "success",
            data: { user: req.user }
        });
    }
);

/**
 * Logout user
 */
export const logout = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;

        // if refresh token is provided - remove it from db
        if (refreshToken) {
            const storedToken = await RefreshToken.findOne({ token: refreshToken });

            // if token was found - remove token family
            if (storedToken) {
                await RefreshToken.deleteMany({ family: storedToken.family });
            }
        }

        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    }
);

/**
 * Get users and return them to the admin
 */
export const getList = catchAsync(
    async (req: Request, res: Response) => {
        const validatedQueryParams = getValidatedQuery<GetUserDTO>(req);
        res.status(200).json({ status: 'success', data: userService.getListOfUsers(validatedQueryParams) })
    }
)