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
        amount:Joi.number().required().min(5000),
        endingDate: Joi.date().iso(),
    });

    const validation = investmentSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}
