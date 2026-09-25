import type { AuthPayload } from "../../types/AuthRequest.types.js";


export interface IJwtService{
    generateAccessToken(payload: AuthPayload): string;
    generateRefreshToken(payload: AuthPayload): string;
    verifyAccessToken(token: string): AuthPayload;
    verifyRefreshToken(token: string): AuthPayload;
}