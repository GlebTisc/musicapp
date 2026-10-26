import z from "zod";

export const RegisterSchema = z.object({
    email: z.email('Invalid email format'),
    username: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50)
        .regex(
            /^[a-zA-Z][a-zA-Z0-9]*([-_.][a-zA-Z0-9]+)?$/,
            'Username must start with a letter, contain letters, numbers and optionally 1 special symbol'
        )
    ,
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;