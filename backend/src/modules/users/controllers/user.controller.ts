
import {injectable,inject} from 'inversify'
import type { IUser } from '../../auth/models/user.model';
import { TYPES } from '../../../DITypes/auth.DIType';
import { USER_TYPES } from '../../../DITypes/Index.DIType';
import type { IUserService } from '../interfaces/IUserService.interface';
import { INFRA_TYPES } from '../../../DITypes/infrastructure.DIType';
import type { IStorageProvider } from '../../../shared/interfaces/IStorageProvider.interface';
import { asyncHandler } from '../../../shared/handler/asyncHandler.handler';
import type { AuthRequest } from '../../../types/AuthRequest.types';
import { NotFoundError } from '../../../shared/errors/NotFoundError.error';
import type { NextFunction,Response } from 'express';
import { UserMapper } from '../DTO/mapper/user.mapper';
import { HTTPStatus } from '../../../shared/enums/httpStatus.enum';
import { ApiResponse } from '../../../shared/responses/ApiResponse.response';
import { BadRequestError } from '../../../shared/errors/BadRequestError.error';
import type { IUserController } from '../interfaces/IUserController.interface';

@injectable()
export class UserController implements IUserController{
    constructor(
        @inject(USER_TYPES.IUserService) private _userService: IUserService,
        @inject(INFRA_TYPES.IStorageProvider) private _storageProvider: IStorageProvider
    ){}

    getProfile = asyncHandler(async(req:AuthRequest,res:Response,_next:NextFunction)=>{
        const user = await this._userService.getProfile(
            req.user?.userId as string
        )
        if(!user){
            throw new NotFoundError("User not found")
        }

        const userDto = UserMapper.toDto(user);// recreate the data structure
        if(userDto.profilePicture){
            // requesting presigned url for user to view the private assets
            userDto.profilePicture = await this._storageProvider.getPresignedUrl(
                userDto.profilePicture
            ) as string;
        }
        res.status(HTTPStatus.OK)
         .json(
            new ApiResponse(
                HTTPStatus.OK,
                "Profile retrieved successfully",
                userDto
            )
        )
    }
  )

  updateProfile = asyncHandler(
    async (req: AuthRequest, res: Response, _next:NextFunction)=>{
        const result = await this._userService.updateProfile(
            req.user?.userId as string,
            req.body
        )

        if(!result) throw new NotFoundError("User not found");
        const resultObj= UserMapper.toDto(result);
        if(resultObj && resultObj.profilePicture){
            resultObj.profilePicture = await this._storageProvider.getPresignedUrl(
                resultObj.profilePicture
            ) as string
        }
        
        res.status(HTTPStatus.OK)
        .json(new ApiResponse(
            HTTPStatus.OK,
            "Profile updated successfully",
            resultObj
        ))


    }
  )


  changePassword = asyncHandler(
    async(req:AuthRequest, res:Response,_next: NextFunction)=>{
        const {oldPassword,newPassword} = req.body;
        const result = await this._userService.changePassword(
            req.user?.userId as string,
            oldPassword,
            newPassword
        )
        res.status(HTTPStatus.OK)
        .json(new ApiResponse(HTTPStatus.OK, result.message))
    }
  )


  updateAvatar = asyncHandler(
    async (req:AuthRequest, res:Response,_next: NextFunction)=>{
        if(!req.file){
            throw new BadRequestError("No file uploaded. please provide an image")
        }

        const result = await this._userService.updateAvatar(
            req.user?.userId as string,
            req.file
        )
        
        const signedUrl = await this._storageProvider.getPresignedUrl(
            result.profilePicture
        )

        res.status(HTTPStatus.OK).json(
            new ApiResponse(HTTPStatus.OK, "Avatar updated successfully",{
                profilePicture: signedUrl
            })
        )

    }
  )


}






