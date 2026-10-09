import type { RequestHandler } from "express";

// Notice: RequestHandler -> built-in type provided by Express for route handlers.

export interface IAdminController{
    getUsers: RequestHandler;
    blockUser: RequestHandler;
    unblockUser: RequestHandler;
    updateUser: RequestHandler;
}






