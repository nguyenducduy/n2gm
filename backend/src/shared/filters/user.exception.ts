import { errorMessagesConfig } from "./messages.error";

export class UserException extends Error {
    public messageCode: string;
    public errorMessage: string;

    constructor(messageCode: string) {
        super("");

        const errorMessageConfig = this.getMessageFromMessageCode(messageCode);
        if (!errorMessageConfig)
            throw new Error("Unable to find message code error.");

        Error.captureStackTrace(this, this.constructor);
        this.message = errorMessageConfig.errorMessage;
    }

    private getMessageFromMessageCode(messageCode: string) {
        let errorMessageConfig;

        Object.keys(errorMessagesConfig).some(key => {
            if (key === messageCode) {
                errorMessageConfig = errorMessagesConfig[key];
                return true;
            }
            return false;
        });

        if (!errorMessageConfig)
            throw new Error("Unable to find the given message code error.");
        return errorMessageConfig;
    }
}
