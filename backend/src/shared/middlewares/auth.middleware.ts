import type { NextFunction } from "express";
import type { AuthRequest } from "../../types/AuthRequest.types.js";
import { asyncHandler } from "../handler/asyncHandler.handler.js";
import type { ISessionService } from "../interfaces/ISessionService.interface.js";


const createAuthenticate = (sessions: ISessionService)=>{
    asyncHandler(async (req:AuthRequest, _res: Response, next: NextFunction)=>{
        const kind = req.baseUrl.endsWith("/admin")
        ? "admin"
        : req.baseUrl.endsWith("/user")
        ? "user"
        : undefined;
        const token = kind
        ? req.cookies?.[`${kind}AccessToken`]
        : req.cookies?.userAccessToken || req.cookies?.adminAccessToken;

        req.user = await sessions.authenticate(token,kind)
        next()
    })
}

export const authenticate  = createAuthenticate(
    
)