import { WebhookData, WebhookData2 } from "../../interfaces/webhook.interface";
import prismaClient from "../../prisma/pris-client";
import { getCurrentDollarRate } from "../../utils/util";
import { Transaction } from "@prisma/client";

export const channelWebHookData = async(dataFromWebhook: WebhookData2) => {
    // Todo: Verify webhook payload comes from Flutterwave using the secret hash set in the Flutterwave Settings

    //* Begin request computations
    const {txRef} = dataFromWebhook;

    // Check for corresponding transaction on the db
    const transaction = await prismaClient.transaction.findFirst({
        where: {transactionReference: txRef}
    })

    // If none, just return
    if (!transaction) {
        throw new Error("Transaction not found in the database")
    }

    //? Now run different transactions depending on transaction type/description
    switch (transaction.description) {
        case "FORU":
            depositIntoForUSaving(dataFromWebhook, transaction)
            break;
        default:
            break;
    }

}

export const depositIntoForUSaving = async(dataFromWebhook: WebhookData2, transaction: Transaction) => {
    // Todo: Put all this logic into a try-catch block
    // Todo: Implement the best practices outlined by Flutterwave docs
    const {status} = dataFromWebhook;

    if (transaction.transactionStatus !== "PENDING") {
        throw new Error("Transaction status has already been modified");
    }

    //Todo: Re-Verify transaction status from flutterwave as per developer guidelines

    if (status !== "successful") {
        // If failed, update and return
        await prismaClient.transaction.update({
            where: {id: transaction.id},
            data: {
                transactionStatus: "FAIL"
            }
        });

        throw new Error("Flutterwave transaction unsuccessful");
    } else {


    //* Transaction status successful and not modified. We can safely deposit the money

    // Update USaveForUTransaction to be successful
    await prismaClient.transaction.update({
        where: {
            id: transaction.id
        },
        data: {
            transactionStatus: "SUCCESS"
        }
    })

    // Modify the USaveForUAccount as needed
    let convertedAmount = 0;

    const uSaveForUAccount = await prismaClient.uSaveForU.findFirst({
        where: {id: transaction.featureId}
    });

    if (uSaveForUAccount?.currency === "USD") {
        let dollarRate = getCurrentDollarRate();
        convertedAmount = transaction.amount / dollarRate
    } else {
        convertedAmount = transaction.amount
    }

    await prismaClient.uSaveForU.update({
        where: {id: transaction.featureId},
        data: {
            investmentCapital: {increment: convertedAmount},
            totalInvestment: {increment: convertedAmount}
        }
    })

    }

}