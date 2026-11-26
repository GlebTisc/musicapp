import UserModel from '../models/User';
import { UserResponse, extractUserFields, validateUserFields } from './authService';
import { NotFoundError } from '../utils/errors';
import { GetUserDTO, RegisterDTO, UpdateUserDTO } from 'src/utils/schemas';

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

    return { items: users, total };
}

export const getUserById = async (id: string): Promise<UserResponse> => {
    const user = await UserModel.findById(id);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return extractUserFields(user);
};

export const createUser = async (data: RegisterDTO): Promise<UserResponse> => {
    await validateUserFields(data);
    const user = await UserModel.create(data);
    return extractUserFields(user);
};

export const updateUser = async (
    id: string,
    data: UpdateUserDTO
): Promise<UserResponse> => {
    const user = await UserModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return extractUserFields(user);
};

export const deleteUser = async (id: string, userId: string | undefined): Promise<void> => {
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
        throw new NotFoundError("User not found");
    }
};