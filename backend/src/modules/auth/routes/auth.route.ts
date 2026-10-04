import {Router} from "express";
import { validate } from "../../../shared/middlewares/validate.middleware";
import { registerSchema } from "../zodSchemas/register.zodSchemas";



const router = Router();

router.post('/register',validate(registerSchema), )
















