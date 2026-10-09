import { Router } from "express";
import { appContainer } from "../../../DiContainer/DiContainer";
import { ADMIN_TYPES } from "../../../DITypes/Index.DIType";
import type { IAdminController } from "../interfaces/IAdminController.interface";
import { authenticate } from "../../../shared/middlewares/auth.middleware";
import { authorizeRoles } from "../../../shared/middlewares/role.middleware";
import { imageUpload } from "../../../shared/middlewares/imageUpload.middleware";
import { validate } from "../../../shared/middlewares/validate.middleware";
import { updateUserSchema } from "../zodSchemas/updateUser.zodSchema";




const adminController = appContainer.get<IAdminController>(
    ADMIN_TYPES.IAdminController
)

const router = Router();

router.use(authenticate, authorizeRoles("admin"));

router.get("/users",adminController.getUsers);
router.patch("/users/:userId/block",adminController.blockUser);
router.patch("/users/:userId/unblock", adminController.unblockUser);
router.patch(
    "/users/:userId",
    imageUpload.single("image"),
    validate(updateUserSchema),
    adminController.updateUser
)


export default router;
