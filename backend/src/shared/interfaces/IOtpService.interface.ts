
type Purpose = "verify" | "reset"

export interface IOtpService{
    getExpirySeconds(): number;
    generateOtp(): string;
    storeOtp(
        email: string,
        otp : string,
        purpose?: Purpose,
    ): Promise<void>;
    deleteOtp(email: string, purpose?: Purpose)
    :Promise<void>;
    getOtp(email: string, purpose?: Purpose)
    :Promise<string|null>
}