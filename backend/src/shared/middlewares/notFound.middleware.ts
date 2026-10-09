import type { NextFunction,Request,Response } from "express";
import { NotFoundError } from "../errors/NotFoundError.error";



export const notFoundMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
)=>{
   next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`))
}