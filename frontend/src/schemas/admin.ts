import { success, z } from 'zod';
import { PasswordField, RoleField, UserCoreSchema } from './user';
import { CategorySchema } from './category';
import { MusicSchema } from './music';

/**
 * Wrapper for admin response
 * 
 * @param item 
 * @returns 
 */
const listResponse = <T extends z.ZodType>(item: T) =>
    z.object({
        status: z.string(),
        data: z.object({
            items: z.array(item).optional(),
            total: z.number().int().nonnegative().optional(),
        }),
    });

export const UserSchema = UserCoreSchema.extend({
    _id: z.string().min(1),
    role: RoleField
});
export type User = z.infer<typeof UserSchema>;

export const UserListSchema = listResponse(UserSchema);

export const CreateUserSchema = UserCoreSchema.extend({
    role: RoleField,
    password: PasswordField,
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = UserCoreSchema.extend({
    role: RoleField,
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

export const CategoryListSchema = listResponse(CategorySchema);

export const MusicListSchema = listResponse(MusicSchema);