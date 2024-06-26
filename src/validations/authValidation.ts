import { Request,Response,NextFunction } from 'express';
import Joi from 'joi';
import ResponseHandler from '../utils/response-handler';



export async function signUpValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    console.log(req.cookies)
    const signUpSchema = Joi.object({
    email: Joi.string().required().regex(emailRegex).message('Email is not valid'),
    });

    const validation = signUpSchema.validate(req.body);
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
        MAILVERIFICATION:Joi.string().uuid().required()
    })
    const validation = otpSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next()
}


export async function basicSetUpValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z0-9!@#$%^&*]).{8,}$/;

    const signUpSchema = Joi.object({
        email:Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required().allow(''),
        password: Joi.string().required().regex(passwordRegex).message('Password is not strong enough'),
        confirmPassword: Joi.string().required().valid(Joi.ref('password')).error(new Error('Password mismatch')),
        phoneNumber:Joi.string().max(15).required(),
        merchantID:Joi.string().optional()
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

        return ResponseHandler.sendErrorResponse({ res, error });
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
        MAILVERIFICATION:Joi.string().uuid().required()
    })
    const validation = schema.validate(req.body);
    if(validation.error){
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }

    return next()
}

export async function resendForgotPasswordValidation(req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const schema = Joi.object({
        resendToken:Joi.string().uuid().required()
    })
    const validation = schema.validate(req.body);
    if(validation.error){
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }

    return next()
}

export async function newDeviceValidation(req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const schema = Joi.object({
        otpCode:Joi.string().required().length(4),
    })
    const validation = schema.validate(req.body);
    if(validation.error){
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }

    const verificationId = req.cookies["identityToken"]
    if(!verificationId){
        return ResponseHandler.sendErrorResponse({res,error:"Verification session exppired",status_code:"LOGIN_REDIRECT"})
    }

    return next()
}


export async function forgotPasswordValidation(req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const schema = Joi.object({
        email:Joi.string().required(),
    })
    const validation = schema.validate(req.body);
    if(validation.error){
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }

    return next()
}


export async function resetPasswordValidation(req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z0-9!@#$%^&*]).{8,}$/;
    const schema = Joi.object({
        otpCode:Joi.string().required().length(4),
        password: Joi.string().required().regex(passwordRegex).message('Password is not strong enough'),
        resetToken:Joi.string().uuid().required()
    })
    const validation = schema.validate(req.body);
    if(validation.error){
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }



    return next()
}


export async function createPinValidation(req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const schema = Joi.object({
        pin:Joi.string().required().length(4),
    });

    const validation = schema.validate(req.body);
    if(validation.error){
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }

    return next()
}


export async function updateBvnValidation(req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{

    const schema = Joi.object({
        bvnNumber : Joi.string().required().max(20),
        dateOfBirth : Joi.date().iso()
    });

    const validation = schema.validate(req.body);
    if(validation.error){
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }

    return next()
}

