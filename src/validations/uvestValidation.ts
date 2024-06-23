import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import ResponseHandler from '../utils/response-handler';
import { CURRENCY,DividendDuration,InvestmentType } from '@prisma/client';

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

    



export async function createUvestValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const createNewUVestFundSchema = Joi.object({
        companyName: Joi.string().required(),
        currency: Joi.string().valid(...Object.values(CURRENCY)).required(),
        unitPrice: Joi.number().required().min(0), 
        historicPerformance: Joi.array().items(Joi.object({
            year: Joi.string().required(),
            performance: Joi.number().required()
        })).required(),
        annualReturns: Joi.number().required(),
        companyLogo: Joi.string().required(),
        about: Joi.string().required(),
        howYouEarn: Joi.string().required(),
        termsOfUse: Joi.string().required(),
        investmentType: Joi.string().valid(...Object.values(InvestmentType)).required(),
        dividendDuration: Joi.string().valid(...Object.values(DividendDuration)).required(),
        nextDividendDate: Joi.date().iso().required(),
    });

    const validation = createNewUVestFundSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}

export async function updateUVestRateValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const createNewUVestFundSchema = Joi.object({
        mutualId: Joi.string().required(),
        rate: Joi.number().required(),
    });

    const validation = createNewUVestFundSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}

export async function updateUnitPriceValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const createNewUVestFundSchema = Joi.object({
        mutualId: Joi.string().required(),
        unitPrice: Joi.number().required(),
    });

    const validation = createNewUVestFundSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}

export async function startMutaulFundInvestmentValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const createNewUVestFundSchema = Joi.object({
        mutualId: Joi.string().required(),
    });

    const validation = createNewUVestFundSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}

export async function mutaulFundDepositValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const createNewUVestFundSchema = Joi.object({
        mutualId: Joi.string().required(),
        numberOfUnits: Joi.number().required(),
        pin: Joi.string().required(),
        paymentMethod: Joi.string().valid("CARD", "BANK", "UWALLET").required(),
    });

    const validation = createNewUVestFundSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        
        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}