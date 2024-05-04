import { NextFunction, Response } from 'express';
import { IExpressRequest } from './user-interface';

type ErrorResCode = "EMAIL_REDIRECT" | "LOGIN_REDIRECT" | "BAD_REQUEST" | "VERIFY_DEVICE"


export interface IReqResNext {
    req: IExpressRequest;
    res: Response;
    next: NextFunction;
}
export interface IResponse {
    res: Response;
    code?: number;
    message?: string;
    data?: any;
    custom?: boolean;
}

export interface IResponseError {
    res: Response;
    code?: number;
    error?: string;
    custom?: boolean;
    status_code?:ErrorResCode;
}


export interface IgoogleResponse {
    family_name: string
    given_name: string
    picture:string
    email:string,
    id: string
}