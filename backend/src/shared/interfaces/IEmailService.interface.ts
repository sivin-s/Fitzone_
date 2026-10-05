export interface IEmailService{
    sendOtp(email:string,otp: string): Promise<void>;   // register
    sendPasswordResetOtp(email:string, otp: string): Promise<void>; // forgot password
}

