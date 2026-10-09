import { Router } from "express";
import { appContainer } from "../../../DiContainer/DiContainer";
import type { IUserController } from "../interfaces/IUserController.interface";
import { USER_TYPES } from "../../../DITypes/Index.DIType";
import { authenticate } from "../../../shared/middlewares/auth.middleware";
import { validate } from "../../../shared/middlewares/validate.middleware";
import { changePasswordSchema, profileSchema } from "../zodSchemas/profile.zodSchema";
import { imageUpload } from "../../../shared/middlewares/imageUpload.middleware";



const router = Router();

// get() asking directly the instance
const userController = appContainer.get<IUserController>(USER_TYPES.IUserController);

router.use(authenticate);

router.get("/profile", userController.getProfile);
router.put("/profile", validate(profileSchema), userController.updateProfile);
router.patch("/change-password",validate(changePasswordSchema),userController.changePassword)
router.patch("/avatar",imageUpload.single("image"),
            userController.updateAvatar
)
export default router;



