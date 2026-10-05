import type { RequestHandler } from "express";



export interface IAuthController{
    register: RequestHandler;
    verifyOtp: RequestHandler;
    resendOtp: RequestHandler;
    login: RequestHandler;
    userMe:  RequestHandler; // is used to get "user role and id" to client when user navigate the pages
    adminMe: RequestHandler; // is used to get "user role and id" to client when user navigate the pages
    refreshToken: RequestHandler;
    forgotPassword: RequestHandler;
    resetPassword: RequestHandler;
    logout: RequestHandler;
    googleAuth: RequestHandler;
}