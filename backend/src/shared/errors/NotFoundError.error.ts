import { HTTPStatus } from "../enums/httpStatus.enum.js";
import { AppError } from "./AppError.error.js";



export class NotFoundError extends AppError{
    constructor(message = "The requested resource was not found"){
        super(message, HTTPStatus.NOT_FOUND)
    }
}