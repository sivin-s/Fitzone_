import { HTTPStatus } from "../enums/httpStatus.enum.js";
import { AppError } from "./AppError.error.js";


export class UnauthorizedError extends AppError{
    constructor(message="Unauthorized. Please login to continue"){
        super(message, HTTPStatus.UNAUTHORIZED)
    }
}