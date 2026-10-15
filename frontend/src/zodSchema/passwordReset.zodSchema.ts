import { z } from 'zod';

// Zod Schema Send OTP
export const forgotSchema = z.object({
    email: z.email('Invalid email address')
        .min(1, 'Email is required')
        .refine((value) => !/\s/.test(value), {
            message: 'Email cannot contain spaces',
        }),
});

export type ForgotFormData = z.infer<typeof forgotSchema>;  // "typeof" why we use because forgotSchema is a object not type

// Zod Schema Reset Password
export const resetSchema = z.object({
    otp: z.string()
        .length(6, 'OTP must be exactly 6 digits')
        .regex(/^\d+$/, 'OTP must contain only numbers'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
            'Password must contain uppercase, lowercase, number, and special character'
        )
        .refine((val) => !/\s/.test(val), { message: 'Password must not contain spaces' }),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

export type ResetFormData = z.infer<typeof resetSchema>;
