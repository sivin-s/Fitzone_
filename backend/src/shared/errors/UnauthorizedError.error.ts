import { HTTPStatus } from "../enums/httpStatus.enum.ts";
import { AppError } from "./AppError.error.ts";


export class UnauthorizedError extends AppError{
    constructor(message="Unauthorized. Please login to continue"){
        super(message, HTTPStatus.UNAUTHORIZED)
    }
}