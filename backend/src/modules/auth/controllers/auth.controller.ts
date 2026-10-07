import type { Request, Response } from "express";



import {inject, injectable} from 'inversify'
import { AUTH_TYPES } from "../../../DITypes/Index.DIType";
import type { IAuthController } from "../interfaces/IAuthController.interface";
import type { IAuthService } from "../interfaces/IAuthService.interface";
import { INFRA_TYPES } from "../../../DITypes/infrastructure.DIType";
import type { ISessionService } from "../../../shared/interfaces/ISessionService.interface";
import { asyncHandler } from "../../../shared/handler/asyncHandler.handler";
import { HTTPStatus } from "../../../shared/enums/httpStatus.enum";
import { ApiResponse } from "../../../shared/responses/ApiResponse.response";
import { getAccessTokenOptions, getRefreshTokenOptions } from "../../../utils/cookieConfig.util";
import { get } from "node:http";


@injectable()
export class AuthController implements IAuthController{
    constructor(
        @inject(AUTH_TYPES.IAuthService) private _authService: IAuthService,
        @inject(INFRA_TYPES.ISessionService) private sessions: ISessionService
    ){}

    register = asyncHandler(async (req: Request, res: Response)=>{
        const {username, email, password} = req.body;
        const result = await this._authService.register(username,email,password);
        res.status(HTTPStatus.CREATED).json(
            new ApiResponse<{
    userId: string;
    expiresInSeconds: number;
}>(HTTPStatus.CREATED, result.message,{
                userId: result.userId,
                expiresInSeconds: result.expiresInSeconds
            })
        )
    })

    //  the handler is used for verify and decode the token return as  payload
    userMe = asyncHandler(async (req: Request,res: Response)=>{
        const payload = await this.sessions.authenticate(
            req.cookies?.userAccessToken,
            "user"
        );
        res.status(HTTPStatus.OK)
        .json(new ApiResponse(HTTPStatus.OK,"User session retrieved",payload))
    })

        //  the handler is used for verify and decode the token return as  payload
    adminMe = asyncHandler(async(req:Request,res:Response)=>{
        const payload = await this.sessions.authenticate(
            req.cookies?.adminAccessToken,
            "admin"
        )
        res.status(HTTPStatus.OK)
        .json(new ApiResponse(HTTPStatus.OK,"Admin Session retrieved", payload))
    })

    verifyOtp = asyncHandler(async(req: Request, res:Response)=>{
       const {email, otp} = req.body;   
       const result = await this._authService.verifyOtp(email,otp);

       const prefix = result.role === "admin" ? "admin" : "user";
       res.cookie(
        `${prefix}AccessToken`,
        result.accessToken,
        getAccessTokenOptions(),
       )
       res.cookie(
        `${prefix}RefreshToken`,
        result.refreshToken,
        getRefreshTokenOptions()
       )
       res.status(HTTPStatus.OK)
       .json(new ApiResponse(HTTPStatus.OK, result.message))
    })

    resendOtp = asyncHandler(async (req: Request, res: Response)=>{
        const {email} = req.body;
        const result = await this._authService.resendOtp(email);
        res.status(HTTPStatus.OK).json(
            new ApiResponse(HTTPStatus.OK, result.message, {
                expiresInSeconds: result.expiresInSeconds
            })
        )
    })

    login = asyncHandler(async (req: Request,res:Response)=>{
        const {email,password} = req.body;
        const result = await this._authService.login(email,password);

        if(result?.user?.role === 'admin'){
            // admin cookie
            res.cookie(
                "adminAccessToken",
                result.accessToken,
                getAccessTokenOptions() // cookie config
            )
             res.cookie(
                "adminRefreshToken",
                result.refreshToken,
                getRefreshTokenOptions()
            )
        }else{
            // user / trainer
            res.cookie(
                "userAccessToken",
                result.accessToken,
                getAccessTokenOptions()
            )
            res.cookie(
                "userRefreshToken",
                result.refreshToken,
                getRefreshTokenOptions()
            )
        }
        res.status(HTTPStatus.OK)
        .json(
            new ApiResponse(HTTPStatus.OK, result.message,{user:result.user})
        )
    })

    // refreshing access token
    refreshToken = asyncHandler(async(req: Request, res: Response)=>{
        const kind = req.body?.session === "admin" ? "admin" : "user";
        try{
            const result = await this.sessions.refresh(
                req.cookies?.[`${kind}RefreshToken`],
                kind   
            )
            res.cookie(
                `${kind}AccessToken`,
                result.accessToken,
                getAccessTokenOptions()
            )
            res.status(HTTPStatus.OK)
            .json(
                new ApiResponse(HTTPStatus.OK,"Access token refreshed successfully")
            )
        }catch(error){
            res.clearCookie(`${kind}AccessToken`,{path:"/"});
            res.clearCookie(`${kind}RefreshToken`,{path: "/"});
            throw error;
        }
    })


  forgotPassword = asyncHandler(async (req:Request,res:Response)=>{
    const{email} = req.body;
    const result = await this._authService.forgotPassword(email);
    res.status(HTTPStatus.OK).json(
        new ApiResponse(HTTPStatus.OK,result.message,{
            expiresInSeconds:result.expiresInSeconds
        })
    )
  })

resetPassword = asyncHandler(async (req:Request,res:Response)=>{
    const {email, otp, newPassword} = req.body;
    const result = await this._authService.resetPassword(
        email,
        otp, 
        newPassword
    );
    res.status(HTTPStatus.OK)
    .json(new ApiResponse(HTTPStatus.OK,result.message))
})

logout = asyncHandler(async(req:Request,res:Response)=>{
    // clear all cookies 
    res.clearCookie("userAccessToken",{path:"/"});
    res.clearCookie("userRefreshToken",{path:'/'})
     res.clearCookie("adminAccessToken",{path:'/'})
      res.clearCookie("adminRefreshToken",{path:'/'})
      res.status(HTTPStatus.OK)
      .json(new ApiResponse(HTTPStatus.OK,"Logged out successfully"))
})

googleAuth = asyncHandler(async(req:Request,res:Response)=>{
    const {idToken} = req.body;
    const result = await this._authService.googleAuth(idToken);
    
    const isAdmin = result.user.role === "admin";
    res.cookie(
        isAdmin ? "adminAccessToken" : "userAccessToken",
        result.accessToken,
        getAccessTokenOptions()  
    )

   res.cookie(
    isAdmin? "adminRefreshToken" : "userRefreshToken",
      result.refreshToken,
    getRefreshTokenOptions()
   )

   res.status(HTTPStatus.OK)
   .json(
    new ApiResponse(HTTPStatus.OK,result.message,{user: result.user})
   )

})



}







