import { HTTPStatus } from "../enums/httpStatus.enum.js";
import { AppError } from "./AppError.error.js";


export class ConflictError extends AppError{
    constructor(message = "Resource already exists or conflicts with current state"){
        super(message, HTTPStatus.CONFLICT)
    }
}