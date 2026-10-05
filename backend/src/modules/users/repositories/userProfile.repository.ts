import { MongoBaseRepository } from "../../../common/repositories/Base.repository";
import User,{type IUser } from "../../auth/models/user.model";
import type { IUserProfileRepository } from "../interfaces/IUserProfileRepository.interface";


export class UserProfileRepository
     extends MongoBaseRepository<IUser>
     implements IUserProfileRepository
{
    constructor(){
        super(User)
    }
    async  updateProfile(userId: string, updateData: Partial<IUser>) : Promise<IUser | null>{
        return this.update(userId, updateData)
    }

    async     updateAvatar(userId: string, profilePicture: string): Promise<IUser | null>{
        return this.update(userId, {profilePicture})
    }
    
}