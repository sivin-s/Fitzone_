import { presignedUrlExpirySchema } from './storage.schema';
import { xid, z, ZodXID } from 'zod';
import dotenv from 'dotenv';


dotenv.config();

// transform and validate
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.string(),
    CLIENT_URL: z.string(),
    MONGO_URI: z.string(),
    REDIS_URI: z.string(),
    JWT_ACCESS_TOKEN: z.string(),
    JWT_REFRESH_TOKEN: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_URL: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_CALLBACK_URL: z.string(),
    // Mailtrap SMTP credentials
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string().transform(Number),
    SMTP_USER: z.string(),  
    SMTP_PASS: z.string(),
    SMTP_FROM_EMAIL: z.email(),
    SMTP_FROM_NAME: z.string(),
    // storage
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_S3_BUCKET: z.string(),
    AWS_S3_PRESIGNED_URL_EXPIRES_IN_SECONDS: presignedUrlExpirySchema,
    // redis otp
    OTP_EXPIRY_SECONDS: z.string().transform(Number),
    OTP_PREFIX: z.string()  // OTP:
})

const parsedEnv = envSchema.safeParse(process.env);

if(!parsedEnv.success){
    console.error(
        "❌ Invalid Environment Variables",
        parsedEnv.error.flatten().fieldErrors
    );
    process.exit(1);
}

export const env = parsedEnv.data;







