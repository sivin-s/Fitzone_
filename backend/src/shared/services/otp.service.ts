import type {Redis} from "ioredis";
import crypto from "crypto";
import type { IOtpService } from "../interfaces/IOtpService.interface";
import { env } from "../../config/env.config";
import {injectable} from 'inversify'

@injectable()
export class OtpService implements IOtpService{
    constructor(
        private store: Pick<Redis, "set" | "get" | "del">,
        private readonly _OTP_PREFIX  = env.OTP_PREFIX,
        private readonly _OTP_EXPIRY_SECONDS = env.OTP_EXPIRY_SECONDS
    ){}

    generateOtp(): string {
        return crypto.randomInt(100000, 1000000).toString();
    }

    getExpirySeconds(): number {
        return env.OTP_EXPIRY_SECONDS;
    }


    async storeOtp(email: string, otp: string, purpose?: "verify" | "reset"): Promise<void> {
        await this.store.set(
            `${this._OTP_PREFIX}${purpose}:${email}`,
            otp,
            "EX",   // expiry -> EX (TTL)
            this._OTP_EXPIRY_SECONDS
             
        )
    }

  async getOtp(email: string, purpose?: "verify" | "reset"): Promise<string | null> {
      return await this.store.get(`${this._OTP_PREFIX}${purpose}:${email}`)
  }

  async deleteOtp(email: string, purpose?: "verify" | "reset"): Promise<void> {
      await this.store.del(`${this._OTP_PREFIX}${purpose}:${email}`);
  }
    
}