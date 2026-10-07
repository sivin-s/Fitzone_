import {inject,injectable} from 'inversify'
import { INFRA_TYPES } from '../../DITypes/infrastructure.DIType';
import type { IJwtService } from '../interfaces/IJwtService.interface';
import type { IUserReader } from '../../modules/users/interfaces/IUserProfileRepository.interface';
import type { AuthPayload } from '../../types/AuthRequest.types';
import type { ISessionService, SessionKind } from '../interfaces/ISessionService.interface';
import { UnauthorizedError } from '../errors/UnauthorizedError.error';




@injectable()
export class SessionService implements ISessionService{
    constructor(
        @inject(INFRA_TYPES.IJwtService) private jwt: IJwtService,
        @inject(INFRA_TYPES.IUserReader) private users: IUserReader
    ){}

    private async validate(
        payload: AuthPayload,
        kind?: SessionKind
    ):Promise<AuthPayload>{
        if(!payload || typeof payload.userId !== "string" || !["user","trainer", "admin"].includes(payload.role)){
            throw new UnauthorizedError("Invalid Session");
        }
        const user = await this.users.findById(payload.userId);
        if(
          user?.role!==payload.role ||
          (kind === "admin" && user.role !== "admin" ) ||
          (kind === "user" && user.role !== "user")
        ){
            throw new UnauthorizedError("Session role has changed. Please log in again")
        }
        return {userId: user._id.toString(), role: user.role};
    }

    async authenticate(token: string | undefined, kind?: SessionKind): Promise<AuthPayload> {
        if(!token) throw new UnauthorizedError("No session found");
        let payload: AuthPayload;
        try{
            payload = this.jwt.verifyAccessToken(token);
        }catch(err){
            throw new UnauthorizedError("Invalid or expired access token")
        }
        return this.validate(payload, kind) // verify role in access token 
    }

    async refresh(token: string | undefined, kind?: SessionKind): Promise<{ accessToken: string; role: AuthPayload['role']; }> {
        if(!token) throw new UnauthorizedError("Refresh token missing");
        let payload: AuthPayload;
        try{
            payload = this.jwt.verifyRefreshToken(token);
        }catch(err){
            throw new UnauthorizedError("Invalid or expired refresh token");
        }
         const current = await this.validate(payload,kind); // verify role in refresh token 
         return {
            accessToken: this.jwt.generateAccessToken(current),
            role: current.role
         }
    }
}












