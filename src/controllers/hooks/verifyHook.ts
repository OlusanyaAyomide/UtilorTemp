import { NextFunction, Response } from 'express';
import { Request } from 'express';
import catchDefaultAsync from "../../utils/catch-async";
import ResponseHandler from "../../utils/response-handler";
import { channelWebHookData } from './hookController';
import { WebhookData, WebhookData2 } from '../../interfaces/webhook.interface';

//this middleware verify the hooks is valid and from flutterwave
export const verifyHook = async(req: Request, res: Response, next: NextFunction)=>{
    
    // Verify webhook payload comes from Flutterwave using the secret hash set in the Flutterwave Settings, if not return

    console.log(req.body);
    console.log(req.headers);

    if (req.headers['verif-hash'] !== process.env.FLW_HASH) {
        console.log("Hash Didn't match")
        ResponseHandler.sendSuccessResponse({res, code: 200, message: "Received"});
        return;
    }

    ResponseHandler.sendSuccessResponse({res, code: 200, message: "Received"});

    // Process the request

    const dataFromWebhook: WebhookData2 = req.body;

    // DO not await processing
    try {
        await channelWebHookData(dataFromWebhook)
    } catch(e) {
        console.log("An error occurred processing webhook");
        console.log(e)
    }

    return

    // return next()
}