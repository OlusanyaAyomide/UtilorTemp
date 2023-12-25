import { Request,Response,NextFunction } from 'express';
import Joi from 'joi';
import ResponseHandler from '../utils/response-handler';

export async function signUpValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z0-9!@#$%^&*]).{8,}$/;

    const signUpSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required().allow(''),
    email: Joi.string().required().regex(emailRegex).message('Email is not valid'),
    password: Joi.string().required().regex(passwordRegex).message('Password is not strong enough'),
    referralId: Joi.string().optional(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).error(new Error('Password mismatch')),
    isAgreed: Joi.boolean().required().valid(true).error(new Error('Accept terms and conditions')),
    });

    const validation = signUpSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    return next()
}   


export async function credentialSignInValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z0-9!@#$%^&*]).{8,}$/;

    const signInSchema = Joi.object({
        email: Joi.string().required().regex(emailRegex).message('Email is not valid'),
        password: Joi.string().required().regex(passwordRegex).message('Password is not strong enough'),
    })

    const validation = signInSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    return next()

}


export async function otpvalidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    
    const otpSchema = Joi.object({
        otpCode:Joi.string().required().length(4),
        verifyToken:Joi.string().optional()

    })
    const validation = otpSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    return next()
    
}


export async function tokenVerifyValidation(req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    
    const tokenVerifySchema = Joi.object({
        otpCode:Joi.string().required().length(4),
        verifyToken:Joi.string().required()
    })

    const validation = tokenVerifySchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 401, error });
    }
    return next()
}

export async function googleSignUpValidation(req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const schema = Joi.object({
        googleToken:Joi.string().required()
    })
    const validation = schema.validate(req.body);
    if(validation.error){
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    return next()
}

export async function resendTokenValidation(req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const schema = Joi.object({
        verifyToken:Joi.string().required()
    })
    const validation = schema.validate(req.body);
    if(validation.error){
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    return next()
}