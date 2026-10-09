import {type IUpdateUserDto} from '../IUpdateUser.dto.ts'

export class  AdminMapper{
    static toUpdateUserServiceData(dto: IUpdateUserDto):IUpdateUserDto{
        return{  // mapper
            username: dto.username,
            email: dto.email,
            role: dto.role,
            isBlocked: dto.isBlocked,
            phone: dto.phone,
            city: dto.city,
            pincode: dto.pincode,
            gender: dto.gender
        }
    }
}






