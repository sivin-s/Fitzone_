import type { NextFunction ,Response} from "express";
import type { AuthRequest } from "../../types/AuthRequest.types.ts";
import { asyncHandler } from "../handler/asyncHandler.handler.ts";
import type { ISessionService } from "../interfaces/ISessionService.interface.ts";
import { appContainer } from "../../DiContainer/DiContainer.ts";
import { INFRA_TYPES } from "../../DITypes/infrastructure.DIType.ts";


const createAuthenticate = (sessions: ISessionService)=>{
    
   return  asyncHandler(async (req:AuthRequest, _res: Response, next: NextFunction)=>{
        const kind = req.baseUrl.endsWith("/admin")
        ? "admin"
        : req.baseUrl.endsWith("/user")
        ? "user"
        : undefined;
        const token = kind
        ? req.cookies?.[`${kind}AccessToken`]
        : req.cookies?.userAccessToken || req.cookies?.adminAccessToken; 
//  req.cookies?.userAccessToken || req.cookies?.adminAccessToken -> fallback
        req.user = await sessions.authenticate(token,kind)  // jwt checking and data body to request body
        next()
    })
}

export const authenticate  = createAuthenticate(
    appContainer.get<ISessionService>(INFRA_TYPES.ISessionService)
)