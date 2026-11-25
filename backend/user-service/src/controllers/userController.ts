import RefreshToken from "src/models/RefreshToken";
import { catchAsync } from "../utils/catchAsync";
import type { Request, Response } from 'express';
import { cookieOptions } from "src/utils/cookies";
import { getValidated } from "src/middleware/validate";
import * as userService from "../services/userService";
import { CreateUserDTO, type GetUserDTO, type GetUserByIdDTO, UpdateUserDTO } from "src/utils/schemas";

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
 * Get users list depending on the filters
 */
export const get = catchAsync(
    async (req: Request, res: Response) => {
        const validatedQueryParams = getValidated.query<GetUserDTO>(req);
        const result = await userService.getListOfUsers(validatedQueryParams);
        res.status(200).json({ status: 'success', data: result })
    }
)

/**
 * Get user by id
 */
export const getOne = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = getValidated.params<GetUserByIdDTO>(req);
        const result = await userService.getUserById(id);
        res.status(200).json({ status: 'success', data: result })
    }
)

/**
 * Create new user
 */
export const create = catchAsync(
    async (req: Request, res: Response) => {
        const validatedData = getValidated.body<CreateUserDTO>(req);
        const user = await userService.createUser(validatedData);
        res.status(201).json({ status: 'success', data: user })
    }
)

/**
 * Update the user
 */
export const update = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = getValidated.params<GetUserByIdDTO>(req);
        const validatedData = getValidated.body<UpdateUserDTO>(req);
        const result = await userService.updateUser(id, validatedData);
        res.status(200).json({ status: 'success', data: result })
    }
)

export const deleteUser = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = getValidated.params<GetUserByIdDTO>(req);

    }
)