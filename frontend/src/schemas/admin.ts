import { z } from 'zod';
import { PasswordField, RoleField, UserCoreSchema } from './user';

export const UserSchema = UserCoreSchema.extend({
    _id: z.string().min(1),
    role: RoleField
});
export type User = z.infer<typeof UserSchema>;

export const UserListSchema = z.object({
    data: z.object({
        items: z.array(UserSchema),
        total: z.number().int().nonnegative().optional(),
    }),
});

export const CreateUserSchema = UserCoreSchema.extend({
    role: RoleField,
    password: PasswordField,
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = UserCoreSchema.extend({
    role: RoleField,
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;