import User, {type IUser} from '../models/user.model.ts';

// base repo

import {MongoBaseRepository} from '../../../common/repositories/Base.repository.ts'
import type { IAuthRepository } from "../interfaces/IAuthRepository.interface.ts";


export class AuthRepository
       extends MongoBaseRepository<IUser>
       implements IAuthRepository
{
       constructor(){
              super(User)
       }

         // using email
       async findByEmail(email: string): Promise<IUser | null>{
              return super.findOne({email}, "+password");
       }
           
       // id in jwt
       async findByIdWithPassword(userId:string):Promise<IUser | null>{
              return this.findOne({_id: userId},"+password");
       }

      async updateVerificationStatus(
       userId: string,
       isVerified: boolean
      ): Promise<IUser | null>{
       return this.update(
              userId,
              {isVerified}
       )
      }

      async updatePassword(
       userId: string,
       newPassword: string
      ): Promise<IUser | null>{  
        const user = await this.findByIdWithPassword(userId);
        if(!user) return null;
        user.password = newPassword;
        await user.save();
        return user;
      }

      async findByGoogleId(googleId: string): Promise<IUser | null>{
       return this.findOne({googleId});
      }

      async linkGoogleId(userId: string, googleId:string):Promise<IUser | null>{
       return this.update(
              userId,
              {googleId, isVerified: true}
       )
      }

      async updateProfile(
       userId: string,
       updateData : Partial<IUser>
      ): Promise<IUser | null>{
       return this.update(userId, updateData)
      }

      async updateAvatar(
       userId: string,
       profilePicture: string
      ): Promise<IUser | null>{
       return this.update(
              userId,
              {profilePicture}
       )
      }


}



