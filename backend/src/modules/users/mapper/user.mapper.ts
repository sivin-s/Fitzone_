import type { IUser } from "../../auth/models/user.model";
import type { IUserDto } from "../DTO/user.dto";



export class UserMapper{
    static toAuthDto(user: IUser){
        return{
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
        }
    }


    static toDto(user: IUser): IUserDto{
        return{
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
            isBlocked: user.isBlocked,
            isVerified: user.isVerified,
            isPremium: user.isPremium,
            profilePicture: user.profilePicture,
            gender: user.gender,
            phone: user.phone,
            city: user.city,
            pincode: user.pincode,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    static toDtoList(users: IUser[]):IUserDto[]{
        return users.map((user) => this.toDto(user))
    }


}