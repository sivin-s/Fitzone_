import {injectable,inject} from 'inversify'
import { INFRA_TYPES } from '../../../DITypes/infrastructure.DIType';
import type { IUserProfileRepository } from '../interfaces/IUserProfileRepository.interface';
import { AUTH_TYPES, LOGGER_TYPES } from '../../../DITypes/Index.DIType';
import type { ILogger } from '../../../shared/interfaces/ILogger.interface';
import type { IStorageProvider } from '../../../shared/interfaces/IStorageProvider.interface';
import type { IUserService } from '../interfaces/IUserService.interface';
import type { IUser } from '../../auth/models/user.model';
import { NotFoundError } from '../../../shared/errors/NotFoundError.error';
import type { IAuthRepository } from '../../auth/interfaces/IAuthRepository.interface';
import { UnauthorizedError } from '../../../shared/errors/UnauthorizedError.error';



@injectable()
export class UserService implements IUserService{
    constructor(
        @inject(INFRA_TYPES.IUserProfileRepository) private _profileRepository: 
                    IUserProfileRepository,
        @inject(LOGGER_TYPES.ILogger) private _logger: ILogger,
        @inject(INFRA_TYPES.IStorageProvider) private _storageProvider: IStorageProvider,
        @inject(AUTH_TYPES.IAuthRepository) private _authRepository: IAuthRepository
    ){}

    async getProfile(userId: string): Promise<IUser> {
        // log
        this._logger.info(`Fetching profile for user: ${userId}`);

        const user = await this._profileRepository.findById(userId);
        if(!user) throw new NotFoundError("User not found");
        return user;
    }

    async updateProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
        const user = await this._profileRepository.findById(userId);
        if(!user) throw new NotFoundError("User not found")

         const {username, phone, city, pincode, gender} = updateData;
        return await this._profileRepository.updateProfile(userId, updateData)
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{ message: string; }>   
    {
        const user = await this._authRepository.findByIdWithPassword(userId);
        if(!user) throw new NotFoundError("User not found");

        const isMatch = await user.comparePassword(oldPassword);
        if(!isMatch) throw new UnauthorizedError("Current password is incorrect");
        
        await this._authRepository.updatePassword(userId,newPassword);
        return {message: "Password changed successfully"}
    }

    async updateAvatar(userId: string, file: Express.Multer.File): Promise<{ profilePicture: string; }> {
        const user = await this._authRepository.findById(userId);
        if(!user) throw new NotFoundError("User not found");

        const newAvatarUrl = await this._storageProvider.uploadFile(file, "avatars");

        try{
            const updated = await this._profileRepository.updateAvatar(
                userId,
                newAvatarUrl
            )
            if(!updated) throw new NotFoundError("User not found");
        }catch(error){
            try{
                await this._storageProvider.deleteFile(newAvatarUrl)
            }catch(error){
                this._logger.warn("New avatar cleanup failed")
            }
            throw error;
        }

        if(user.profilePicture && user.profilePicture !== newAvatarUrl){
            try{
                await this._storageProvider.deleteFile(user.profilePicture);
            }catch(error){
                this._logger.warn("Old avatar cleanup failed")
            }
        }
        return {profilePicture: newAvatarUrl}


    }


}








