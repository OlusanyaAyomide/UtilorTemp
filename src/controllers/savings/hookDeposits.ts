import prismaClient from "../../prisma/pris-client";
import { WebhookData2 } from "../../interfaces/webhook.interface";
import { CURRENCY, Transaction } from "@prisma/client";
import { getCurrentDollarRate } from "../../utils/util";
import { getConvertedRate } from "../../utils/transactions.util";

export const depositIntoForUSavingViaFlutterwave = async(dataFromWebhook: WebhookData2, transaction: Transaction) => {
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

    const uSaveForUAccount = await prismaClient.uSaveForU.findFirst({
        where: {id: transaction.featureId}
    });

    if (!uSaveForUAccount) {
        throw new Error("For-U account not found");
    }

    const depositAmount = getConvertedRate({amount:transaction.amount,from:dataFromWebhook.currency as CURRENCY,to:uSaveForUAccount.currency})
    // let convertedAmount = 0;

    // if (uSaveForUAccount.currency === "USD" && transaction.transactionCurrency == "NGN") {
    //     let dollarRate = getCurrentDollarRate();
    //     convertedAmount = transaction.amount / dollarRate
    // } else if (uSaveForUAccount.currency === "NGN" && transaction.transactionCurrency == "USD") {
    //     let dollarRate = getCurrentDollarRate();
    //     convertedAmount = transaction.amount * dollarRate
    // } else {
    //     convertedAmount = transaction.amount
    // }

    await prismaClient.uSaveForU.update({
        where: {id: transaction.featureId},
        data: {
            investmentCapital: {increment: depositAmount},
            totalInvestment: {increment: depositAmount},
        }
    })

    }

}



export const depositIntoUAndISavingViaFlutterwave = async(dataFromWebhook: WebhookData2, transaction: Transaction) => {
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

    const uAndISaving = await prismaClient.uANDI.findFirst({
        where: {id: transaction.featureId}
    });

    if (!uAndISaving) {
        throw new Error("For-U account not found");
    }

    const depositAmount = getConvertedRate({amount:transaction.amount,from:transaction.transactionCurrency,to:uAndISaving.currency})
    
    const isCreator = transaction.userId === uAndISaving.creatorId
    if(isCreator){
        await prismaClient.uANDI.update({
            where: {id: uAndISaving.id},
            data: {
                  creatorCapital:{increment:depositAmount},
                  totalCapital:{increment:depositAmount},
                  isActivated:true
            }
        });
    }else{
        await prismaClient.uANDI.update({
            where: {id: uAndISaving.id},
            data: {
                  partnerCapital:{increment:depositAmount},
                  totalCapital:{increment:depositAmount},
                  isActivated:true
            }
        });
    }



    }

}