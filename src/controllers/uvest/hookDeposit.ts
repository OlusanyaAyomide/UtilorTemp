import { Transaction } from "@prisma/client"
import { WebhookData2 } from "../../interfaces/webhook.interface"
import prismaClient from "../../prisma/pris-client";
import { getConvertedRate } from "../../utils/transactions.util";
import { generateTransactionRef } from "../../utils/util";

export const depositIntoUVestViaFlutterwave = async(dataFromWebhook: WebhookData2, transaction: Transaction) => {
    const {status} = dataFromWebhook
    

    if (transaction.transactionStatus !== "PENDING") {
        throw new Error("Transaction status has already been modified");
    }
    
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
        const userPortfolio = await prismaClient.userMutualFund.findFirst({
            where:{id:transaction.featureId},
            include:{
                mutualFund:true
            }
        })
        
        if(!userPortfolio){
            throw new Error("product could not be found")
        }

        const mutualFund = userPortfolio.mutualFund
        const depositAmount = getConvertedRate({
                from:transaction.transactionCurrency,
                to:mutualFund.currency,
                amount:transaction.amount
        })

        console.log(depositAmount)
        //update balance with actual account        
        await prismaClient.userMutualFund.update({
            where:{id:userPortfolio.id},
            data:{
                activeBalance:{increment:depositAmount},
                visibleBalance:{increment:depositAmount}
            }
        })

        await prismaClient.transaction.create({
            data: {
                userId:transaction.userId,
                transactionReference:generateTransactionRef(),
                amount: depositAmount,
                transactionCurrency: mutualFund.currency,
                description:"UVEST",
                paymentMethod: transaction.paymentMethod,
                transactionType:"DEPOSIT", 
                featureId:userPortfolio.id
        }})
    }
}