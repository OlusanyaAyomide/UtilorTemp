import { Request, Response, NextFunction, RequestHandler } from 'express';
import ResponseHandler from './response-handler';


const catchDefaultAsync = (handler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(handler(req, res, next)).catch((error) => {
            console.error('Error caught in catchAsync:', error);
            ResponseHandler.sendErrorResponse({res,code:500,error:"Server error"})
        });
    };
};

export default catchDefaultAsync;