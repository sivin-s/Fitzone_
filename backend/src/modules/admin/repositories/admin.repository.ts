import { injectable } from "inversify";
import { MongoBaseRepository } from "../../../common/repositories/Base.repository";
import User, {type IUser } from "../../auth/models/user.model";
import type { IAdminRepository } from "../interfaces/IAdminRepository.interface";
import type { QueryFilter } from "mongoose";
import type { UserListOptions } from "../zodSchemas/listUsers.zodSchema";


@injectable()
export class AdminRepository extends MongoBaseRepository<IUser>implements IAdminRepository{

    constructor(){
        super(User)
    }

     async findUsers(
        search= "",
        page= 1,
        limit = 20,
        options?: UserListOptions
    ){
       const query: QueryFilter<IUser> = {role:{$ne: "admin"}};
       if(search){
        const literal =  search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.$or = [
            {username: {$regex: literal, $options: "i"}},
            {email: {$regex: literal, $options: "i"}}
        ]
       }
       if(options?.membership === "premium") query.isPremium = true;
       if(options?.membership === "trainers") query.role = "trainer";
       if(options?.membership === "basic"){
        query.role = "user";
        query.isPremium = {$ne: true};
       }
       if(options?.status === "active") query.isBlocked = false;
       if(options?.status === "blocked") query.isBlocked = true;
       const direction = options?.sortOrder === "asc" ? 1 : -1;
       const {items: users, ...pagination} = await this.findPaginated(
        query,
        page,
        limit,
        "-password",
        {
            sort: {[options?.sortBy ?? "createdAt"]: direction, _id: direction},
            collation: {locale: "en", strength: 2}
        }
       )
       return {users, ...pagination}

    }

    async blockUser(
        userId: string
    ):Promise<IUser | null>{
        return this.update(userId,{isBlocked: true});
    }

    async unblockUser(userId: string):Promise<IUser | null>{
        return this.update(userId, {isBlocked: false})
    }

    async updateUser(
        userId: string,
        data: Partial<Pick<IUser,
          | "username"
          | "email"
          | "role"
          | "isBlocked"
          | "gender"
          | "phone"
          | "city"
          | "pincode"
          | "profilePicture"
        >>
    ): Promise<IUser | null>{
        return this.update(userId, {$set: data})
    }


}












