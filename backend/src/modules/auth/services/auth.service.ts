import {INFRA_TYPES} from '../../../DITypes/infrastructure.DIType.ts';  // infrastructure like external services like mongodb, redis and external tools like jwt
import type { IGoogleAuthProvider } from '../../../shared/interfaces/IGoogleAuthProvider.interface.ts';
import type { IAuthRepository } from '../interfaces/IAuthRepository.interface.ts';
import type { IOtpService } from '../../../shared/interfaces/IOtpService.interface.ts';
import type { IJwtService } from '../../../shared/interfaces/IJwtService.interface.ts';
import type {IAuthService} from '../interfaces/IAuthService.interface.ts'


import {inject, injectable} from 'inversify'
import {AUTH_TYPES as TYPES} from '../../../DITypes/Index.DIType.ts'
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError.error.ts';
import { ConflictError } from '../../../shared/errors/ConflictError.error.ts';
import { UserMapper } from '../../users/DTO/mapper/user.mapper.ts';
import type { IEmailService } from '../../../shared/interfaces/IEmailService.interface.ts';
import { BadRequestError } from '../../../shared/errors/BadRequestError.error.ts';

@injectable()
export class AuthService implements IAuthService{
    constructor(
      @inject(TYPES.IAuthRepository) private _authRepository: IAuthRepository,
      @inject(INFRA_TYPES.IOtpService) private otpService: IOtpService,
      @inject(INFRA_TYPES.IJwtService) private jwtService: IJwtService,
      @inject(INFRA_TYPES.IGoogleAuthProvider) private googleProvider: IGoogleAuthProvider,
      @inject(INFRA_TYPES.IEmailService) private emailService: IEmailService
    ){}


    async googleAuth(idToken: string): Promise<{ message: string; user: { id: string; username: string; email: string; role: string; }; accessToken: string; refreshToken: string; }> {
        const googleUser = await this.googleProvider.verify(idToken);

        const email = googleUser.email;
        const googleId = googleUser.sub; // claim - unique (PK)
        const username = googleUser.name || email.split("@").at(0);

        //  check if user exists by google id
        let user = await this._authRepository.findByGoogleId(googleId);
        
        if(user){
            if(user.isBlocked){
                throw new UnauthorizedError("Your account has been blocked");
            }
        }else{
            const existingEmailUser = await this._authRepository.findByEmail(email);
            if(existingEmailUser){
               if(existingEmailUser.isBlocked){
                  throw new UnauthorizedError("You account has been blocked")
               }
               if(existingEmailUser.googleId){
                  throw new ConflictError("This email is already linked to a different google account")
               }
               // link the google id to existing user
               user = await this._authRepository.linkGoogleId(
                existingEmailUser._id.toString(),
                googleId
               )
            }else{
                user = await this._authRepository.create({
                    username,
                    email,
                    googleId,
                    isVerified:true,
                    role: "user"
                })
            }
        }

        if(!user){
            throw new UnauthorizedError("Unable to authenticate with google")
        }

        // generate tokens
        const payload = {userId: user._id.toString(), role: user.role};
        const accessToken = this.jwtService.generateAccessToken(payload);
        const refreshToken = this.jwtService.generateRefreshToken(payload);

        return{
            message: "Google authentication successful",
            user: UserMapper.toAuthDto(user),
            accessToken,
            refreshToken
        }

    }


    async register(username: string, email: string, password: string): Promise<{ message: string; userId: string; expiresInSeconds: number; }> {
        const existingUser = await this._authRepository.findByEmail(email);
        if(!existingUser){
            throw new ConflictError("This email is already registered");
        }
        const newUser = await this._authRepository.create({
            username,
            email,
            password,
            isVerified: false
        })
        const otp = this.otpService.generateOtp();
        await this.otpService.storeOtp(email, otp); // store in redis
        await this.emailService.sendOtp(email, otp);
        return{
            message: "Registration successful. Please check your email for the OTP",
            userId: newUser._id.toString(),
            expiresInSeconds: this.otpService.getExpirySeconds() // dynamic otp expiry for frontend,
        }
    }
    
    async verifyOtp(email: string, otp: string): Promise<{ message: string; role: 'user' | 'trainer' | 'admin'; accessToken: string; refreshToken: string; }> {
        const user = await this._authRepository.findByEmail(email);
        if(!user) throw new BadRequestError("User not found");
        if(user.isVerified) throw new BadRequestError("User is already verified ");

        const storedOtp = await this.otpService.getOtp(email);
        if(!storedOtp || storedOtp !== otp){
            throw new BadRequestError("Invalid or expired OTP")
        }

        await this._authRepository.updateVerificationStatus(
            user._id.toString(),
            true
        )

        await this.otpService.deleteOtp(email);

        const payload = {userId: user._id.toString(), role: user.role};
        return{
            message: "Email verified successfully",
            role: user.role,
            accessToken: this.jwtService.generateAccessToken(payload),
            refreshToken: this.jwtService.generateRefreshToken(payload)
        }
    }
     
    async resendOtp(email: string): Promise<{ message: string; expiresInSeconds: number; }> {
        const user = await this._authRepository.findByEmail(email);
        if(!user) throw new BadRequestError("User is already verified");
        if(!user.isVerified) throw new BadRequestError("User is already verified");

        const otp = this.otpService.generateOtp();
        await this.otpService.storeOtp(email,otp);
        await this.emailService.sendOtp(email,otp);

        return {
            message: "A new OTP has been sent to your email",
            expiresInSeconds: this.otpService.getExpirySeconds() // dynamic otp expiry for frontend
        }

    }


    async login(email: string, password: string): Promise<{ message: string; user: { id: string; username: string; email: string; role: string; isVerified: boolean; }; accessToken: string; refreshToken: string; }> {
        const user = await this._authRepository.findByEmail(email);
        if(!user) throw new UnauthorizedError("Invalid email or password");
        if(user.isBlocked){
            throw new UnauthorizedError("Your account has been blocked by the admin")
        }
        if(!user.isVerified){
            throw new UnauthorizedError("Please verify your email before logging in")
        }

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            throw new UnauthorizedError("Invalid email  or password");
        }

        const payload = {
            userId: user._id.toString(),
            role: user.role
        }

        // token
        const accessToken = this.jwtService.generateAccessToken(payload);
        const refreshToken = this.jwtService.generateRefreshToken(payload);

        return {
            message: "Login successful",
            user: UserMapper.toAuthDto(user),
            accessToken,
            refreshToken
        }
    }

    async forgotPassword(email: string): Promise<{ message: string; expiresInSeconds: number; }> {
        const user = await this._authRepository.findByEmail(email);
        if(!user){
            return {  // dummy
                message: "If an account with this email exists, an OTP has been sent",
                expiresInSeconds: this.otpService.getExpirySeconds()
            }
        }
        const otp = this.otpService.generateOtp();
        await this.otpService.storeOtp(email, otp, "reset");
        await this.emailService.sendPasswordResetOtp(email, otp);

        return{
            message: "If an account with this email exists, an OTP has been sent.",
            expiresInSeconds: this.otpService.getExpirySeconds(), // dynamic otp expiry for frontend
        }

    }



    async resetPassword(email: string, otp: string, newPassword: string): Promise<{ message: string; }> {
        // profile no otp need.
        const user = await this._authRepository.findByEmail(email);
        if(!user) throw new BadRequestError("Invalid request");

        const storedOtp = await this.otpService.getOtp(email, "reset");
        if(!storedOtp || storedOtp !==otp){
            throw new BadRequestError("Invalid or expired OTP")
        }

        await this._authRepository.updatePassword(user._id.toString(), newPassword);
        await this.otpService.deleteOtp(email, "reset");

        return {message: "Password reset successfully"}
    }


}





















