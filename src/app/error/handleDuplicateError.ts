import { TErrorSources, TGenericErrorResponse } from "../interface/error";


export const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const regex = /"([^"]+)"/;

    // Extract the value
    const extractedMessage = err.message.match(regex)[1];
    const errorSources: TErrorSources = [
        {
            path: "",
            message: `${extractedMessage} is already exists`
        }
    ]
    const statusCode = 400;
    return {
        statusCode,
        message: "Duplicate Error",
        errorSources,
    }
}