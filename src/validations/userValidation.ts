import { Request, Response, NextFunction } from 'express';
import Joi from "joi";
import ResponseHandler from "../utils/response-handler";


export async function createConsentValidation(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const paymentMethodRegex = /^(UWALLET|BANK|CARD)$/; // Regular expression for paymentMethod enum

    const depositSchema = Joi.object({
        description:Joi.string().valid("FORU", "UANDI","UWALLET").required()
    });

    const validation = depositSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, error });
    }

    return next();
}
