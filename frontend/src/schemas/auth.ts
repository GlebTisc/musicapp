import { z } from 'zod';
import { PasswordField, UserCoreSchema } from './user';

export const LoginSchema = z.object({
    username: z.string().min(1, 'Username is required').max(50),
    password: z.string().min(1, 'Password is required').max(128),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export const RegisterSchema = UserCoreSchema
    .extend({
        password: PasswordField,
        confirmPassword: z.string(),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        { message: "Passwords don't match", path: ['confirmPassword'] },
    );

export type RegisterDTO = z.infer<typeof RegisterSchema>;