import { z } from 'zod';

const emailField = z.email('Invalid email format');

const usernameField = z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50)
    .regex(
        /^[a-zA-Z][a-zA-Z0-9]+$/,
        'Username must contain letters and numbers'
    );

const passwordField = z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(
        /^(?=.{10,128}$)[a-zA-Z][a-zA-Z0-9]*[!@#$%^&*()_+\-=,.?][a-zA-Z0-9]+$/,
        'Password must be at least 10 characters long, contain 1 symbol, letters and numbers'
    );

const roleField = z.enum(['user', 'admin']);

const UserCoreSchema = z.object({
    username: usernameField,
    email: emailField
});

export const RegisterSchema = UserCoreSchema.extend({
    password: passwordField
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    username: z.string().min(1, 'Username is required').max(50),
    password: z.string().min(1, 'Password is required').max(128),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export const GetUserParamsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    search: z.string().trim().min(1).max(255).optional()
});

export type GetUserDTO = z.infer<typeof GetUserParamsSchema>;

export const GetUserByIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
});

export type GetUserByIdDTO = z.infer<typeof GetUserByIdSchema>;

export const CreateUserSchema = UserCoreSchema.extend({ password: passwordField, role: roleField });

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = UserCoreSchema.extend({ role: roleField });

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;