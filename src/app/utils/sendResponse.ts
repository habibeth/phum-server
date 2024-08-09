import { Response } from "express";
import httpStatus from "http-status";

type TResponse<T> = {
    // statusCode: number;
    // success: boolean;
    message: string
    data: T
}


export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        success: true,
        message: data.message,
        data: data.data
    })
}