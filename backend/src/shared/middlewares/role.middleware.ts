import type { NextFunction,Response } from "express"
import type { AuthRequest } from "../../types/AuthRequest.types"
import { UnauthorizedError } from "../errors/UnauthorizedError.error"
import { AppError } from "../errors/AppError.error"
import { HTTPStatus } from "../enums/httpStatus.enum"


export const authorizeRoles = (  
    ...allowedRoles: Array<"user" | "trainer" | "admin">
 ) =>{
     return (req: AuthRequest, res: Response, next: NextFunction)=>{
         if(!req.user){
            throw new UnauthorizedError("Authentication required");
         }
         if(!allowedRoles.includes(req.user.role)){
            throw new AppError(
                `Access denied. Required role: ${allowedRoles.join(", ")}. Your role: ${req.user.role}`,
                HTTPStatus.FORBIDDEN
            );
         }
         next();
     }
}








