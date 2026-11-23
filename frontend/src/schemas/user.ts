import { z } from 'zod';

export const EmailField = z.email('Invalid email format');

export const UsernameField = z.string()
    .min(4, 'Name must be at least 4 characters')
    .max(50)
    .regex(/^[a-zA-Z][a-zA-Z0-9]+$/, 'Username must contain letters and numbers');

export const PasswordField = z.string()
    .min(10, 'Password must be at least 10 characters')
    .max(128)
    .regex(
        /^(?=.{10,128}$)[a-zA-Z][a-zA-Z0-9]*[!@#$%^&*()_+\-=,.?][a-zA-Z0-9]+$/,
        'Password must be at least 10 characters long, contain 1 symbol, letters and numbers'
    );

export const RoleField = z.enum(['user', 'admin']);

export const UserCoreSchema = z.object({
    email: EmailField,
    username: UsernameField,
});