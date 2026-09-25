import { HTTPStatus } from "../enums/httpStatus.enum.js";
import { AppError } from "./AppError.error.js";

export class BadRequestError extends AppError{
    constructor(message="Bad Request"){
        super(message, HTTPStatus.BAD_REQUEST)
    }
}