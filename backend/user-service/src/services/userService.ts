import { z } from 'zod';
import UserModel from '../models/User';
import { UserResponse, extractUserFields } from './authService';
import { ForbiddenError, NotFoundError } from '../utils/errors';

export const GetUserParamsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    search: z.string().trim().min(1).max(255).optional()
});

export type GetUserDTO = z.infer<typeof GetUserParamsSchema>;

export const UpdateUserSchema = z.object({
    username: z.string().min(2).max(50).optional(),
    email: z.email().optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

/**
 * Get list of users + count them depending on query params
 * 
 * @param param0 
 * @returns 
 */
export const getListOfUsers = async ({ page, search }: GetUserDTO) => {
    // number of users per page - 20
    const offset = (page - 1) * 20;

    const query: Record<string, unknown> = {};

    // check if search is filled
    if (search) {
        query.username = { $regex: search, $options: 'i' };
    }

    const [users, total] = await Promise.all([
        UserModel.find(query).skip(offset).limit(20).exec(),
        UserModel.countDocuments(query)
    ]);

    return { users, total };
}

export const getUserById = async (id: string): Promise<UserResponse> => {
    const user = await UserModel.findById(id);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return extractUserFields(user);
};

export const updateUser = async (
    id: string,
    data: UpdateUserDTO,
    requestingUserId: string,
    requestingUserRole: string
): Promise<UserResponse> => {
    if (id !== requestingUserId && requestingUserRole !== 'admin') {
        throw new ForbiddenError("You can only update your own profile");
    }

    const user = await UserModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return extractUserFields(user);
};

export const deleteUser = async (
    id: string,
    requestingUserId: string,
    requestingUserRole: string
): Promise<void> => {
    if (id !== requestingUserId && requestingUserRole !== 'admin') {
        throw new ForbiddenError("You can only delete your own account");
    }

    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
        throw new NotFoundError("User not found");
    }
};