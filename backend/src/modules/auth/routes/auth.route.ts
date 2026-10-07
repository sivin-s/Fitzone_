import {Router} from "express";
import { validate } from "../../../shared/middlewares/validate.middleware";
import { registerSchema } from "../zodSchemas/register.zodSchemas";
import { appContainer } from "../../../DiContainer/DiContainer";
import type { IAuthController } from "../interfaces/IAuthController.interface";
import { AUTH_TYPES } from "../../../DITypes/Index.DIType";
import { verifyOtpSchema } from '../zodSchemas/verifyOtp.zodSchemas';
import { resendOtpSchema } from "../zodSchemas/resendOtp.zodSchemas";
import { loginSchema } from "../zodSchemas/login.zodSchemas";
import  { forgotPasswordSchema } from "../zodSchemas/forgotPassword.zodSchemas";


// injection


const authController = appContainer.get<IAuthController>(
    AUTH_TYPES.IAuthController 
)

const router = Router();

router.post('/register',validate(registerSchema), authController.register);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);
router.post('/resend-otp',validate(resendOtpSchema), authController.resendOtp);

router.post('/login',validate(loginSchema), authController.login);

router.get("/user-me", authController.userMe); // is for decode token return data
router.get("/admin-me", authController.adminMe); // is for decode token return data

router.post("/google",authController.googleAuth);

router.post("/refresh-token", authController.refreshToken); // call when "retry" check refresh token return new access token

router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    authController.forgotPassword,
);
router.post(
    "/reset-password",
    validate(resendOtpSchema),
    authController.resetPassword
)

router.post("/logout", authController.logout);

// export
export default router;












