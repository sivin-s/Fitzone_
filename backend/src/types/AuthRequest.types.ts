import type {Request} from "express";

// role
type Role = "user"
   | "trainer"
   | "admin"


// data contains in the request (jwt token);
export interface AuthPayload{
    userId: string;
    role: Role
}

export interface  AuthRequest extends Request{
    user?: AuthPayload; // for request body
}

