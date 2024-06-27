import { Request, Response, NextFunction, RequestHandler } from 'express';

import ResponseHandler from './response-handler';
import { IExpressRequest } from '../interfaces/user-interface';
import * as core from 'express-serve-static-core';
import { stringifyError } from './util';

type ExpressQuest = Request<core.ParamsDictionary, any,any>

type CustomHandler = ExpressQuest & IExpressRequest



type CustomRequestHandler = 
    (req: CustomHandler, res: Response<any>, next: NextFunction) => Promise<(Response<any, Record<string, any>>) | void>;

const catchDefaultAsync = (handler: CustomRequestHandler) => {
    return (req:IExpressRequest, res: Response, next: NextFunction) => {
        Promise.resolve(handler(req, res, next)).catch((error) => {
            console.error('Error caught in catchAsync:', error);
            ResponseHandler.sendErrorResponse({res,code:500,error:stringifyError(error)})
        });
    };
};

export default catchDefaultAsync;