import { NextFunction, Request, Response } from "express";
import { WebhookData } from "../../interfaces/webhook.interface";
import prismaClient from "../../prisma/pris-client";
import catchDefaultAsync from "../../utils/catch-async";
import ResponseHandler from "../../utils/response-handler";
import { getCurrentDollarRate } from "../../utils/util";

export const channelWebHookData = async(req: Request, res: Response, next: NextFunction) => {
    
    // Send success message back to Flutterwave to prevent delay and resending of webhook notification;
    res.status(200).json({message: "Webhook notification received"});
    
    // // Todo: Verify webhook payload comes from Flutterwave using the secret hash set in the Flutterwave Settings

    //* Begin request computations
    const eventType = req.body['event.type'] // 'event.type' is sent as a string in flutterWave's response
    
    // Cast webhook data to appropriate type
    const dataFromWebhook: WebhookData = req.body;

    // Retrieve transaction reference and transaction status
    const {tx_ref} = dataFromWebhook.data;

    // Check for corresponding transaction on the db
    const transaction = await prismaClient.transaction.findFirst({
        where: {transactionReference: tx_ref}
    })

    // If none, just return
    if (!transaction) {
        return
    }

    console.log("********************************");
    console.log(transaction.description);
    console.log("********************************");

    //? Now run different transactions depending on transaction type/description
    switch (transaction.description) {
        case "FORU":
            depositIntoForUSaving(dataFromWebhook)
            break;
        default:
            break;
    }

}

export const depositIntoForUSaving = async(dataFromWebhook: WebhookData) => {
    // Todo: Put all this logic into a try-catch block
    // Todo: Implement the best practices outlined by Flutterwave docs
    const {tx_ref, status} = dataFromWebhook.data;

    const correspondingUSaveForUTransaction = await prismaClient.usaveForUTransaction.findFirst({
        where: {transactionRef: tx_ref}
    });

    // If no corresponding u-save/forU transaction not found, return
    if (!correspondingUSaveForUTransaction) {
        return
    }

    // If corresponding u-save/forU transaction found, but already updated, return
    if (correspondingUSaveForUTransaction.transactionStatus !== "PENDING") {
        return
    }

    //Todo: Re-Verify transaction status from flutterwave as per developer guidelines
    if (status !== "successful") {
        // If failed, update and return
        await prismaClient.usaveForUTransaction.update({
            where: {id: correspondingUSaveForUTransaction.id},
            data: {
                transactionStatus: "FAIL"
            }
        });

        return
    } else {
    //* Transaction status successful, uSaveForUTransaction not modified. We can safely deposit the money

    // Update USaveForUTransaction to be successful
    await prismaClient.usaveForUTransaction.update({
        where: {
            id: correspondingUSaveForUTransaction.id
        },
        data: {
            transactionStatus: "SUCCESS"
        }
    })

    // Modify the USaveForUAccount as needed
    let convertedAmount = 0;

    const uSaveForUAccount = await prismaClient.uSaveForU.findFirst({
        where: {id: correspondingUSaveForUTransaction.uSaveForUAccountId}
    });

    if (uSaveForUAccount?.currency === "USD") {
        let dollarRate = getCurrentDollarRate();
        convertedAmount = correspondingUSaveForUTransaction.amount / dollarRate
    } else {
        convertedAmount = correspondingUSaveForUTransaction.amount
    }

    await prismaClient.uSaveForU.update({
        where: {id: correspondingUSaveForUTransaction.uSaveForUAccountId},
        data: {
            investmentCapital: {increment: convertedAmount},
            totalInvestment: {increment: convertedAmount}
        }
    })

    }

}