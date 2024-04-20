import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import ResponseHandler from '../utils/response-handler';


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



export async function depositUWalletValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    // const paymentMethodRegex = /^(BANK|CARD)$/; // Regular expression for paymentMethod enum

    const depositSchema = Joi.object({
        id: Joi.string().required(),
        amount:Joi.number().required().min(1),
    });

    const validation = depositSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}

