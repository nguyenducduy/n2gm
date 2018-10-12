import { ValidationError } from "class-validator";

export class ValidateException extends Error {
    constructor(errors: ValidationError[]) {
        super("");

        let msg = {};

        errors.forEach((error: ValidationError) => {
            Object.keys(error.constraints).forEach((key: string) => {
                if (!msg[error.property]) {
                    msg[error.property] = [];
                }
                msg[error.property].push(error.constraints[key]);
            });
        });

        Error.captureStackTrace(this, this.constructor);
        this.message = JSON.stringify(msg);
    }
}
