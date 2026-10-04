import { HTTPStatus } from "../enums/httpStatus.enum.ts";
import { AppError } from "./AppError.error.ts";

export class BadRequestError extends AppError{
    constructor(message="Bad Request"){
        super(message, HTTPStatus.BAD_REQUEST)
    }
}