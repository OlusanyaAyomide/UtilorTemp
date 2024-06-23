import {  WebhookData2 } from "../../interfaces/webhook.interface";
import prismaClient from "../../prisma/pris-client";
import { manageReferralBalance } from "./hookUtility";
import { depositIntoEmeergencySavingViaFlutterwave, depositIntoForUSavingViaFlutterwave, depositIntoMyCabalSavingViaFlutterwave, depositIntoUAndISavingViaFlutterwave } from "../savings/hookDeposits";
import { depositIntoUWalletViaFlutterwave } from "../wallet/walletController";
import { depositIntoUVestViaFlutterwave } from "../uvest/hookDeposit";

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
            manageReferralBalance(transaction)
            depositIntoUWalletViaFlutterwave(dataFromWebhook, transaction)
            break;
        case "EMERGENCY":
            manageReferralBalance(transaction)
            depositIntoEmeergencySavingViaFlutterwave(dataFromWebhook,transaction)
            break
        case "UANDI":
            manageReferralBalance(transaction)
            depositIntoUAndISavingViaFlutterwave(dataFromWebhook,transaction)
            break
        case "CABAL":
            depositIntoMyCabalSavingViaFlutterwave(dataFromWebhook,transaction)
            break
        case "UVEST":
            depositIntoUVestViaFlutterwave(dataFromWebhook,transaction)
            break
        default:
            break;
    }

}

