import { z } from 'zod';
import UserModel from '../models/User';
import { UserResponse, extractUserFields } from './authService';
import { AppError } from '../utils/AppError';

export const UpdateUserSchema = z.object({
    username: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

export const getUserById = async (id: string): Promise<UserResponse> => {
    const user = await UserModel.findById(id);
    if (!user) {
        throw new AppError('User not found', 404, 'Not Found Error');
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
        throw new AppError('You can only update your own profile', 403, 'Forbidden Error');
    }

    const user = await UserModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw new AppError('User not found', 404, 'Not Found Error');
    }

    return extractUserFields(user);
};

export const deleteUser = async (
    id: string,
    requestingUserId: string,
    requestingUserRole: string
): Promise<void> => {
    if (id !== requestingUserId && requestingUserRole !== 'admin') {
        throw new AppError('You can only delete your own account', 403, 'Forbidden Error');
    }

    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
        throw new AppError('User not found', 404, 'Not Found Error');
    }
};