import type { IUser } from "../../auth/models/user.model";
import type { UserListOptions } from "../zodSchemas/listUsers.zodSchema";


export interface IAdminService{
    getUsers(
        search?: string,
        page?: number,
        limit?: number,
        options?: UserListOptions
    ):Promise<{
        users: Array<IUser>;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>
    blockUser(userId: string, adminId: string):Promise<IUser>;
    unblockUser(userId: string): Promise<IUser>;
    updateUser(
        userId: string,
        adminId: string,
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
        >>,
        file?: Express.Multer.File
    ):Promise<IUser | null>
}