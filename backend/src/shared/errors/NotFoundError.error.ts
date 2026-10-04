import { HTTPStatus } from "../enums/httpStatus.enum.ts";
import { AppError } from "./AppError.error.ts";



export class NotFoundError extends AppError{
    constructor(message = "The requested resource was not found"){
        super(message, HTTPStatus.NOT_FOUND)
    }
}