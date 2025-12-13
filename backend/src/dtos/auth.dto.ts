import { z } from 'zod';

export const registerSchema = z.object({
    email: z.email({ message: 'Invalid email format' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email({ message: 'Invalid email format' }),
    password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginDto = z.infer<typeof loginSchema>;
