import type {IUser} from '../../auth/models/user.model.ts';

export interface IUserReader{
    findById(id: string, selectFields?: string):Promise<IUser | null>
}

export interface IUserProfileRepository extends IUserReader{
    findByIdWithPassword(id: string): Promise<IUser | null>;
    updateProfile(id: string, data: Partial<IUser>) : Promise<IUser | null>;
    updatePassword(id: string, data: Partial<IUser>): Promise<IUser | null>;
    updateAvatar(id: string, data: Partial<IUser>): Promise<IUser | null>;
}















