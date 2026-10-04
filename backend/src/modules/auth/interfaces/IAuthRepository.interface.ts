import { authenticate } from './../../../shared/middlewares/auth.middleware';
import type {IBaseRepository} from '../../../common/interfaces/IBaseRepository.interface'
import type { IUser } from '../models/user.model';

export interface IAuthRepository extends Pick<IBaseRepository<IUser>, "create" | "findById">
{
    // auth methods
  findByEmail(email: string): Promise<IUser | null>;
  updateVerificationStatus(
    userId: string,
    isVerified: boolean
  ): Promise<IUser | null>;
  updatePassword(userId: string, newPassword: string):Promise<IUser | null>;

  // google auth methods
  findByGoogleId(googleId:string):Promise<IUser | null>;
  linkGoogleId(userId: string, googleId: string): Promise<IUser | null>;


}















