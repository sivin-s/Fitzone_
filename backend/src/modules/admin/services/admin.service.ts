import { injectable,inject } from "inversify";
import { ADMIN_TYPES, LOGGER_TYPES } from "../../../DITypes/Index.DIType";
import type { IAdminRepository } from "../interfaces/IAdminRepository.interface";
import { INFRA_TYPES } from "../../../DITypes/infrastructure.DIType";
import type { IStorageProvider } from "../../../shared/interfaces/IStorageProvider.interface";
import type { ILogger } from "../../../shared/interfaces/ILogger.interface";
import { listUserSchema, type UserListOptions } from "../zodSchemas/listUsers.zodSchema";
import { BadRequestError } from "../../../shared/errors/BadRequestError.error";
import type { IAdminService } from "../interfaces/IAdminService.interface";
import type { IUser } from "../../auth/models/user.model";
import { NotFoundError } from "../../../shared/errors/NotFoundError.error";



@injectable()
export class AdminService implements IAdminService{
    constructor(
        @inject(ADMIN_TYPES.IAdminRepository) private _adminRepository: IAdminRepository,
        @inject(INFRA_TYPES.IStorageProvider) private _storageProvider: IStorageProvider,
        @inject(LOGGER_TYPES.ILogger) private  _logger: ILogger
    ){}

    async getUsers(
        search?: string,
        page: number = 1,
        limit: number = 20,
        options?: UserListOptions
    ){
        if(
            (search !== undefined && typeof search !== "string") || !Number.isInteger(page) ||
             page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 1000
        ){
          throw new BadRequestError("Invalid search or pagination parameters")   
        }
        const parsed = listUserSchema.parse({search,page, limit, ...options})  // zod
        return await this._adminRepository.findUsers(
            parsed.search,
            parsed.page,
            parsed.limit,
            parsed
        )

    }


    async blockUser(userId: string, adminId: string): Promise<IUser> {
        if(userId === adminId){
            throw new BadRequestError("You cannot block your own account")
        }
        const user = await this._adminRepository.blockUser(userId);
        if(!user) throw new NotFoundError("User not found");
        return user;
    }

    async unblockUser(userId: string): Promise<IUser> {
        const user = await this._adminRepository.unblockUser(userId);
        if(!user) throw new NotFoundError("User not found");
        return user;
    }

    async updateUser(userId: string, adminId: string, data: Partial<Pick<IUser, "username" | "email" | "role" | "isBlocked" | "gender" | "phone" | "city" | "pincode" | "profilePicture">>, file?: Express.Multer.File): Promise<IUser | null> {
        if(userId === adminId && data.role && data.role !== "admin"){
            throw new BadRequestError("Admins cannot change their own role")
        }
        if(userId === adminId && data.isBlocked){
            throw new BadRequestError("You cannot block your own account")
        }
        const existing = await this._adminRepository.findById(userId);
        if(!existing) throw new NotFoundError("User not found");
        const uploaded = file
                    ? await this._storageProvider.uploadFile(file, "avatars")
                    : undefined;
        const updateData = uploaded ? {...data, profilePicture: uploaded} : data;
        let updated: IUser | null;
        try{
            updated = await this._adminRepository.updateUser(userId, updateData);
            if(!updated) throw new NotFoundError("User not found")
        }catch(error){
            if(uploaded){
                try{
                    await this._storageProvider.deleteFile(uploaded);
                }catch(error){
                    this._logger.warn("New avatar cleanup failed")
                }
            }
            throw error;
        }
        if(updateData.profilePicture && existing.profilePicture && updateData.profilePicture !== existing.profilePicture){
            try{
                await this._storageProvider.deleteFile(existing.profilePicture);
            }catch(error){
                this._logger.warn("Old avatar cleanup failed")
            }
        }
        return updated;
    }




}






