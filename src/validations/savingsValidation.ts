import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import ResponseHandler from '../utils/response-handler';
import { CURRENCY } from '@prisma/client';


export async function createForUValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const currencyRegex = /^(NGN|USD)$/; // Regular expression for currency enum

    const investmentSchema = Joi.object({
        currency: Joi.string().required().regex(currencyRegex).message('Currency must be either NGN or USD'),
        savingsName: Joi.string().required(),
        expectedDepositDay: Joi.number().integer().required(),
        expectedMonthlyAmount: Joi.number().integer().required(),
        // amount:Joi.number().required().min(5000),
        endingDate: Joi.date().iso().required(),
        iconLink : Joi.string().required()
    });

    const validation = investmentSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }
    
    return next();
}


export async function depositForUValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const paymentMethodRegex = /^(UWALLET|BANK|CARD)$/; // Regular expression for paymentMethod enum

    const depositSchema = Joi.object({
        id: Joi.string().required(),
        amount:Joi.number().required().min(1),
        paymentMethod: Joi.string().required().regex(paymentMethodRegex).message("Payment method must be either 'UWALLET', 'BANK', or 'CARD' ")
    });

    const validation = depositSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}


//should be moved
export async function depositUWalletValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    // const paymentMethodRegex = /^(BANK|CARD)$/; // Regular expression for paymentMethod enum

    const depositSchema = Joi.object({
        id: Joi.string().required(),
        amount:Joi.number().required().min(1),
        currency: Joi.string().valid(...Object.values(CURRENCY)).required(),
        paymentMethod: Joi.string().valid("CARD", "BANK").required()
    });

    const validation = depositSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}



export async function createUAndIValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const currencyRegex = /^(NGN|USD)$/; // Regular expression for currency enum

    const investmentSchema = Joi.object({
        currency: Joi.string().required().regex(currencyRegex).message('Currency must be either NGN or USD'),
        savingsName: Joi.string().required(),
        expectedDepositDay: Joi.number().integer().required(),
        expectedMonthlyAmount: Joi.number().integer().required(),
        // amount:Joi.number().required().min(5000),
        endingDate: Joi.date().iso().required(),
        consentToken:Joi.string().min(9).required(),
        iconLink : Joi.string().required(),
    });

    const validation = investmentSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}


export async function createCabalValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {

    const investmentSchema = Joi.object({
        lockedInDate:Joi.date().iso().required(),
        groupName:Joi.string(),
        currency: Joi.string().valid(...Object.values(CURRENCY)).required(),
        iconLink : Joi.string().required(),
        description : Joi.string().required()
    });

    const validation = investmentSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}



export async function sendCabalInvitationValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {

    const investmentSchema = Joi.object({
        merchantId : Joi.string().required(),
        cabalId : Joi.string().required()
    });

    const validation = investmentSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}


export async function startCabalValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {

    const investmentSchema = Joi.object({
        cabalId : Joi.string().required()
    });

    const validation = investmentSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}

export async function addPromoCodeValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {

    const investmentSchema = Joi.object({
        savingsId : Joi.string().required(),
        promoCode : Joi.string().required()
    });

    const validation = investmentSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}

export async function savingsInterestValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
 
    const investmentSchema = Joi.object({
        duration : Joi.number().required(),
    });


    const validation = investmentSchema.validate(req.query);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}


export async function forUWithdrawalValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {

    const investmentSchema = Joi.object({
        forUId : Joi.string().required(),
        amount : Joi.number().required()
    });

    const validation = investmentSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}

export async function emergencyUWithdrawalValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {

    const investmentSchema = Joi.object({
        emergencyId : Joi.string().required(),
        amount : Joi.number().required()
    });

    const validation = investmentSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}

export async function uAndIValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {

    const investmentSchema = Joi.object({
        uAndIId : Joi.string().required(),
        amount : Joi.number().required()
    });

    const validation = investmentSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}
