import { WebhookData, WebhookData2 } from "../../interfaces/webhook.interface";
import prismaClient from "../../prisma/pris-client";
import { getCurrentDollarRate } from "../../utils/util";
import { Transaction } from "@prisma/client";
import { manageReferralBalance } from "./hookUtility";
import { depositIntoForUSavingViaFlutterwave, depositIntoUAndISavingViaFlutterwave } from "../savings/hookDeposits";
import { getConvertedRate, updateTransactionStatus } from "../../utils/transactions.util";

export const channelWebHookData = async(dataFromWebhook: WebhookData2) => {
    // Todo: Verify webhook payload comes from Flutterwave using the secret hash set in the Flutterwave Settings
    console.log("channeled after response")
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
            manageReferralBalance(transaction)
            depositIntoForUSavingViaFlutterwave(dataFromWebhook, transaction)
            break;
        case "UWALLET":
            console.log("in here")
            manageReferralBalance(transaction)
            depositIntoUWallet(dataFromWebhook, transaction)
            break;
        case "UANDI":
            manageReferralBalance(transaction)
            depositIntoUAndISavingViaFlutterwave(dataFromWebhook,transaction)
            break
        default:
            break;
    }

}


//u wallet handler should be created later
export const depositIntoUWallet = async(dataFromWebhook: WebhookData2, transaction: Transaction) => {
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

    // Modify the UWallet as needed
    
    const uWallet = await prismaClient.uWallet.findFirst({
        where: {id: transaction.featureId}
    });
    
    if (!uWallet) {
        throw new Error("U-Wallet not found");
    }
    
    // let convertedAmount = 0;

    const depositAmount = getConvertedRate({amount:transaction.amount,from:transaction.transactionCurrency,to:uWallet.currency})
    // if (uWallet.currency === "USD" && transaction.transactionCurrency == "NGN") {
    //     let dollarRate = getCurrentDollarRate();
    //     convertedAmount = transaction.amount / dollarRate
    // } else if (uWallet.currency === "NGN" && transaction.transactionCurrency == "USD") {
    //     let dollarRate = getCurrentDollarRate();
    //     convertedAmount = transaction.amount * dollarRate
    // } else {
    //     convertedAmount = transaction.amount
    // }

    await prismaClient.uWallet.update({
        where: {id: transaction.featureId},
        data: {
            balance: {increment: depositAmount}, 
        }
    })
    await updateTransactionStatus(transaction.id,"SUCCESS")


    }

}