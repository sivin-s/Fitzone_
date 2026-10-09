import { injectable,inject } from "inversify";
import { ADMIN_TYPES, LOGGER_TYPES } from "../../../DITypes/Index.DIType";
import { INFRA_TYPES } from "../../../DITypes/infrastructure.DIType";
import type { IStorageProvider } from "../../../shared/interfaces/IStorageProvider.interface";
import { asyncHandler } from "../../../shared/handler/asyncHandler.handler";
import type {Request,Response,NextFunction, RequestHandler} from 'express'
import { listUserSchema } from "../zodSchemas/listUsers.zodSchema";
import type { IAdminController } from "../interfaces/IAdminController.interface";
import { UserMapper } from "../../users/DTO/mapper/user.mapper";
import { HTTPStatus } from "../../../shared/enums/httpStatus.enum";
import { ApiResponse } from "../../../shared/responses/ApiResponse.response";
import type { AuthRequest } from "../../../types/AuthRequest.types";
import type { IAdminService } from "../interfaces/IAdminService.interface";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.error";
import { BadRequestError } from "../../../shared/errors/BadRequestError.error";
import { NotFoundError } from "../../../shared/errors/NotFoundError.error";
import type { ILogger } from "../../../shared/interfaces/ILogger.interface";
import { AdminMapper } from "../DTO/mapper/admin.mapper";

@injectable()
export class AdminController implements IAdminController{
    constructor(
        @inject(ADMIN_TYPES.IAdminService) private _adminService: IAdminService,
        @inject(INFRA_TYPES.IStorageProvider) private _storageProvider: IStorageProvider,
        @inject(LOGGER_TYPES.ILogger) private _logger: ILogger
    ){}

    getUsers = asyncHandler(
        async(req:Request,res:Response,_next:NextFunction):Promise<void>=>{
             const {search, page, limit, ...options} = listUserSchema.parse(
                req.query
             );
             const result = await this._adminService.getUsers(
                search,
                page,
                limit,
                options
             )
             const usersList = UserMapper.toDtoList(result.users); // dto bulk
             const usersWithUrls  = await Promise.all(
                usersList.map( async (u)=>{
                    if(u.profilePicture){
                        u.profilePicture = await this._storageProvider.getPresignedUrl(
                            u.profilePicture
                        ) as string;
                    }
                    return u;
                })
             )
             res.status(HTTPStatus.OK).json(new ApiResponse(
                HTTPStatus.OK, "Users retrieved successfully",{
                    users: usersWithUrls,
                    total: result?.total,
                    page: result?.page,
                    limit: result?.limit,
                    totalPages: result.totalPages
                }
             ))
        }
    )

    blockUser= asyncHandler(
        async(
            req:AuthRequest,
            res: Response,
            _next: NextFunction
        ):Promise<void>=>{
            const {userId}  = req.params;
            const adminId = req.user?.userId;
            const result = await this._adminService.blockUser(
                userId as string,
                adminId as string
            );
            res.status(HTTPStatus.OK).json(
                new ApiResponse(HTTPStatus.OK,"User blocked successfully",{
                    isBlocked: result.isBlocked
                })
            )
        }
    )


    unblockUser = asyncHandler(
        async (req:Request, res: Response,_next: NextFunction): Promise<void>=>{
            const {userId} = req.params;
            const result = await this._adminService.unblockUser(userId as string);
            res.status(HTTPStatus.OK).json(
                new ApiResponse(HTTPStatus.OK,"User unblocked successfully",{
                    isBlocked: result.isBlocked
                })
            )
        }
    )


  
  updateUser = asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      _next: NextFunction,
    ): Promise<void> => {
      const data = req.body;

      const serviceData = AdminMapper.toUpdateUserServiceData(data) // dto mapper
    
      const adminId = req.user?.userId as string;
      const userId = req.params?.userId as string;

      const updateUser = await this._adminService.updateUser(
        userId,
        adminId,
        serviceData,
        req.file,
      );
      if (!updateUser) {
        throw new NotFoundError("User not found");
      }
      const userDto = UserMapper.toDto(updateUser);
      if (userDto.profilePicture) {
        userDto.profilePicture = await this._storageProvider.getPresignedUrl(
          userDto.profilePicture,
        ) as string;
      }
      res
        .status(HTTPStatus.OK)
        .json(
          new ApiResponse(HTTPStatus.OK, "User updated successfully", userDto),
        );
    },
  );

}

