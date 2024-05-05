import { Request,Response,NextFunction } from 'express';
import Joi from 'joi';
import ResponseHandler from '../utils/response-handler';
import { DESCRIPTION_TYPE } from '@prisma/client';



export async function createPromoCodeValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{

    const signUpSchema = Joi.object({
    percentage:Joi.number().required(),
    name:Joi.string().required(),
    revokedAt : Joi.date().iso().required(),
    expiredAt : Joi.date().iso().required(),
    product : Joi.string().valid(...Object.values(DESCRIPTION_TYPE)).required(),
    });

    const validation = signUpSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
 
    return next()
}
