import {email, z} from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.email("Invalid email format").toLowerCase().trim(),
        password: z.string("Password is required").min(8, "Password is required")
    })
})