import catchDefaultAsync from "../../utils/catch-async";
import ResponseHandler from "../../utils/response-handler";
import prismaClient from "../../prisma/pris-client";
import { IPaymentInformation, IUWalletDepositInformation } from "../../interfaces/interface";
import { generateTransactionRef } from "../../utils/util";
import { generatePaymentLink } from "../../config/requests";
import { getConvertedRate, updateTransactionStatus } from "../../utils/transactions.util";
import { WebhookData2 } from "../../interfaces/webhook.interface";
import { Transaction } from "@prisma/client";

//tempoary balance view, will be extended later
export const getWalletInfo = catchDefaultAsync(async(req,res,next)=>{
    const userId = req.user?.userId 

    const wallet = await prismaClient.uWallet.findFirst({
        where:{userId}
    })
    

    if(!wallet){
        return ResponseHandler.sendErrorResponse({res,error:"Wallet not found"})
        
    }

    const transactions = await prismaClient.transaction.findMany({
        where:{featureId:wallet.id},
        orderBy:{
            createdAt:"desc"
        }
    })
    return ResponseHandler.sendSuccessResponse({res,data:{...wallet,transactions}})

})


//deposits into u walet
export const depositIntoUWallet = catchDefaultAsync(async(req, res, next) => {
    const depositData: IUWalletDepositInformation = req.body;
    const tx_ref = generateTransactionRef();

    const user = req.user;

    const uWallet = await prismaClient.uWallet.findFirst({
        where: {id: depositData.id}
    })

    if (!uWallet) {
        return ResponseHandler.sendErrorResponse({res, code: 400, error: "Specified U-Wallet not found"})
    }

    if (!user) {
        return ResponseHandler.sendErrorResponse({res, code: 500, error: "Something went wrong"})
    }

    console.log(`
        ------------${tx_ref}---------------
    `)

    const paymentInformation: IPaymentInformation = {
        user,
        tx_ref,
        amount: depositData.amount,
        //? Might remove or add this later, currency: "NGN", // Users can only deposit in NGN
        currency: depositData.currency,
        product: "FORU",
        productId: uWallet.id
    }

    const paymentLink = await generatePaymentLink(paymentInformation);

    if (paymentLink) {
        
        // Save the transaction to the database, holding the type of transaction created
        const newTransaction = await prismaClient.transaction.create({
            data: {
                userId: user.userId,
                amount: paymentInformation.amount,
                transactionReference: tx_ref,
                transactionCurrency: paymentInformation.currency,
                description: "UWALLET",
                paymentMethod: depositData.paymentMethod,
                transactionType: "DEPOSIT",
                featureId: uWallet.id
            }
        });

        if (!newTransaction) {
            return ResponseHandler.sendErrorResponse({res, error: "Transaction could not be initialized", code: 500})
        }

        return ResponseHandler.sendSuccessResponse({res,data:paymentLink})
    } else {
        return ResponseHandler.sendErrorResponse({res,error:"Payment link could not be generated"})
    }
})





//u wallet handler should be created later
export const depositIntoUWalletViaFlutterwave = async(dataFromWebhook: WebhookData2, transaction: Transaction) => {
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


    await prismaClient.uWallet.update({
        where: {id: transaction.featureId},
        data: {
            balance: {increment: depositAmount}, 
        }
    })
    await updateTransactionStatus(transaction.id,"SUCCESS")


    }

}