import {email, z} from 'zod';

export const updateUserSchema = z.object({
    // schema
    body: z.object({
        username: z.string().min(3).optional(),
        email: z.email("Invalid email format").optional(),
        role: z.enum(["admin","user","trainer"]).optional(),
        isBlocked: z.preprocess(
            (value)=> (value === "true" ? true : value === "false" ? false : value),
            z.boolean().optional(),
        ),
        phone: z.string().optional(),
        city: z.string().optional(),
        pincode: z.string().optional(),
        gender: z.enum(["male","female","other"]).optional()
    })
})

// export type UpdateUserRequestDto = z.infer<typeof updateUserSchema>["body"] // incoming dto







