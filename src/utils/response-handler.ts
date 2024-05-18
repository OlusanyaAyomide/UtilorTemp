
import { Response } from 'express';
import { IResponse,IResponseError } from '../interfaces/response-interfaces';

class ResponseHandler {
    // Success Response Handler
    public static sendSuccessResponse({
        res,
        code = 200,
        message = 'Operation Successful',
        data = null,
        custom = false,
    }: IResponse): Response<any> {
        const response = custom && data ? { ...data } : { success: true, code: code, message, data };
        return res.status(code).json(response);
    }

    // Error Response Handler
    public static sendErrorResponse({
        res,
        code=400,
        status_code ="BAD_REQUEST",
        error = 'Operation failed',
        custom = false,
        data = null
    }: IResponseError): Response<any> {
        const response = custom ? { code: code,status_code, message: error ,data } : { success: false, code: code, message: error,status_code,data };
        return res.status(code).json(response);
    }

    public static sendUnauthorizedResponse({
        res,
        code=403,
        error = 'Unauthorized Response',
        custom = false,
    }: IResponseError): Response<any> {
        const response = custom ? { code: code, message: error } : { success: false, code: code, message: error };
        return res.status(code).json(response);
    }
}

export default ResponseHandler;
