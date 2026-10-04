import { HTTPStatus } from "../enums/httpStatus.enum.ts";
import { AppError } from "./AppError.error.ts";


export class ConflictError extends AppError{
    constructor(message = "Resource already exists or conflicts with current state"){
        super(message, HTTPStatus.CONFLICT)
    }
}