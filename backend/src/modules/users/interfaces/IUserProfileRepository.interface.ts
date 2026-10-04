import type {IUser} from '../../auth/models/user.model.ts';

export interface IUserReader{
    findById(id: string, selectFields?: string):Promise<IUser | null>
}

export interface IUserProfileRepository extends IUserReader{
    updateProfile(userId: string, data: Partial<IUser>) : Promise<IUser | null>;
    updateAvatar(userId: string, profilePicture: string): Promise<IUser | null>;
}















