import jwt , {type SignOptions} from "jsonwebtoken";
import { env } from "../../config/env.config";
import type { IJwtService } from "../interfaces/IJwtService.interface";
import type { AuthPayload } from "../../types/AuthRequest.types";


export class JwtService implements IJwtService{
    generateAccessToken(payload: AuthPayload): string {
        const {exp: _exp, iat: _iat, ...cleanPayload} = payload;
        return jwt.sign(cleanPayload,env.JWT_ACCESS_SECRET,{
            expiresIn: env.ACCESS_TOKEN_EXPIRES_IN
        } as SignOptions)
    }

    generateRefreshToken(payload: AuthPayload): string {
        const {exp: _exp, iat: _iat, ...cleanPayload} = payload;
        return jwt.sign(cleanPayload, env.JWT_REFRESH_SECRET,{
            expiresIn: env.REFRESH_TOKEN_EXPIRES_IN
        } as SignOptions)
    }
    
    verifyAccessToken(token: string): AuthPayload {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;
    }

    verifyRefreshToken(token: string): AuthPayload {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthPayload;
    }
}




















