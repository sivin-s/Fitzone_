import {OAuth2Client}  from "google-auth-library";
import { env } from "../../config/env.config";
import { UnauthorizedError } from "../errors/UnauthorizedError.error";
import type { IGoogleAuthProvider } from "../interfaces/IGoogleAuthProvider.interface";

export class GoogleAuthProvider implements IGoogleAuthProvider{
    private readonly client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    
    async verify(idToken: string){
        try{
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: env.GOOGLE_CLIENT_ID
            })
            const payload = ticket.getPayload();
            if(!payload?.email || !payload.email_verified){
                throw new Error("Unverified identity");
            }
        return {
                    email: payload?.email,
                    sub: payload?.sub,
                    name: payload?.name
        }
            
        }catch(_e){
            throw new UnauthorizedError("Invalid Google token")
        }
    }
}















