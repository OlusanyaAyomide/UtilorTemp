import catchDefaultAsync from "../../utils/catch-async";
import prismaClient from "../../prisma/pris-client";
import ResponseHandler from "../../utils/response-handler";
import { ICreateForU, IDepositForU } from "../../interfaces/bodyInterface";
import { generateTransactionRef } from "../../utils/util";
import { generatePaymentLink } from "../../config/requests";
import { IPaymentInformation } from "../../interfaces/interface";
import { saveForUTransaction, saveTransaction, saveUwalletTransaction, updateForUTransactionStatus, updateGenericTransactionStatus, updateUWalletTransactionStats } from "../../utils/transactions.util";
import { TransactionData, USaveForUTransactionData, UWalletTransactionData } from "../../interfaces/transactions.interface";
import { UWalletTransaction } from "@prisma/client";



export const createNewForUplan = catchDefaultAsync(async(req,res,next)=>{
    const user = req.user;
    const forUData:ICreateForU = req.body;

    const now = new Date();
    const ending = new Date(forUData.endingDate);

    // Prevent from setting ending date in the past;
    if (now >= ending) {
        return ResponseHandler.sendErrorResponse({res, error: "Ending date must be in the future", code: 400});
    }
    
    if(!user){return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})}
    
    const {...rest} = forUData
    const newSaving = await prismaClient.uSaveForU.create({
        data:{
            userId:user.userId,
            investmentCapital:0,
            totalInvestment:0,
            returnOfInvestment:0,
            ...rest
        }
    });
    
    return ResponseHandler.sendSuccessResponse({res, code: 200, message: `ForU savings "${forUData.savingsName}" created successfully`});

})

export const depositIntoForUSavings = catchDefaultAsync(async(req, res, next) => {
    const tx_ref = generateTransactionRef();
    const depositData: IDepositForU = req.body;

    const user = req.user;
    // Verify there is indeed a valid user
    if(!user){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    // Check if ForU account is valid

    const forUAccount = await prismaClient.uSaveForU.findFirst({
        where: {id: depositData.id}
    })

    if (!forUAccount) {
        return ResponseHandler.sendErrorResponse({res, code: 404, error: "ForU savings account not found"});
    }

    // Proceed if exists
    const {amount} = depositData;

    // Check if payment method is USTASH and compute as required
    if (depositData.paymentMethod === "UWALLET") {
        // Check for Valid UWALLET
        const uWallet = await prismaClient.uWallet.findFirst({
            where: {
                userId: user.userId,
                currency: "NGN" // user can only pay in NGN
            }
        });

        // Respond with error if no valid wallet
        if (!uWallet) {
            return ResponseHandler.sendErrorResponse({res, error: "No U-Wallet found", code: 404})
        }

        // Respond with error if valid wallet has insufficient balance
        if (uWallet.balance < amount) {
            return ResponseHandler.sendErrorResponse({res, error: "Insufficient funds in U-Wallet", code: 400})
        }

        // Proceed if all else passes

        // initialize  For-U deposit transaction data
        const forUDepositGenericTransactionData: TransactionData = {
            userId: user.userId,
            transactionReference: tx_ref,
            amount: depositData.amount,
            transactionCurrency: uWallet.currency,
            description: "FORU",
            paymentMethod: depositData.paymentMethod,
            transactionType: "DEPOSIT"
        }
        
        const uWalletWithdrawalGenericTransactionData: TransactionData = {
            ...forUDepositGenericTransactionData,
            description: "UWALLET",
            transactionType: "WITHDRAWAL"
        }
        
        // Save the generic transactions to the database, holding the type of transaction created
        const newForUDepositGenericTransaction = await saveTransaction(forUDepositGenericTransactionData);
        const newUWalletWithdrawalGenericTransaction = await saveTransaction(uWalletWithdrawalGenericTransactionData);

        // Initialize U-save/For-U transaction data
        const forUTransactionData: USaveForUTransactionData = {
            ...forUDepositGenericTransactionData,
            uSaveForUAccountId: forUAccount.id,
        };

        // Save the ForU transaction to the database
        const newForUTransaction = await saveForUTransaction(forUTransactionData);

        

        // Initialize U-wallet transaction data
        const uWalletTransactionData: UWalletTransactionData = {
            ...uWalletWithdrawalGenericTransactionData,
            uWalletAccountId: uWallet.id
        };

        // Save the U-Wallet transaction to the database
        const newUWalletTransaction = await saveUwalletTransaction(uWalletTransactionData);


        // Remove from wallet
        const updateUWallet = await prismaClient.uWallet.update({
            where: {id: uWallet.id},
            data: {
                balance: {decrement: amount}
            }
        });

        // Return error if wallet withdrawal fails
        if (!updateUWallet) {

            // Update Generic Transactions status to failed
            await updateGenericTransactionStatus(newUWalletWithdrawalGenericTransaction.id, "FAIL");
            await updateGenericTransactionStatus(newForUDepositGenericTransaction.id, "FAIL");
    
            // Update main U-Wallet transaction to be failed
            await updateUWalletTransactionStats(newUWalletTransaction.id, "FAIL");
            
            // Update main For-U transaction to be failed
            await updateForUTransactionStatus(newForUTransaction.id, "FAIL");

            return ResponseHandler.sendErrorResponse({res, code: 500, error: "Could not debit from U-Wallet"});
        }

        // Add to forU
        const updateForU = await prismaClient.uSaveForU.update({
            where: {id: forUAccount.id},
            data: {
                investmentCapital: {increment: amount},
                totalInvestment: {increment: amount},
            }
        });

        // If for-U update failed
        if (!updateForU) {

            // Update Generic Transactions status to failed
            await updateGenericTransactionStatus(newUWalletWithdrawalGenericTransaction.id, "FAIL");
            await updateGenericTransactionStatus(newForUDepositGenericTransaction.id, "FAIL");
    
            // Update main U-Wallet transaction to be failed
            await updateUWalletTransactionStats(newUWalletTransaction.id, "FAIL");
            
            // Update main For-U transaction to be failed
            await updateForUTransactionStatus(newForUTransaction.id, "FAIL");

            // Reimburse U-Wallet
            await prismaClient.uWallet.update({
                where: {id: uWallet.id},
                data: {
                    balance: {increment: amount}
                }
            });

            // Send error response
            return ResponseHandler.sendErrorResponse({res, code: 500, error: "Could not credit for-U"});

            
        }

        // Update Generic Transactions status to successful
        await updateGenericTransactionStatus(newUWalletWithdrawalGenericTransaction.id, "SUCCESS");
        await updateGenericTransactionStatus(newForUDepositGenericTransaction.id, "SUCCESS");

        // Update main U-Wallet transaction to be successful
        await updateUWalletTransactionStats(newUWalletTransaction.id, "SUCCESS");
        
        // Update main For-U transaction to be successful
        await updateForUTransactionStatus(newForUTransaction.id, "SUCCESS");


        // Return success response
        return ResponseHandler.sendSuccessResponse({
            res,
            code: 200,
            message: `For-U account "${forUAccount.savingsName}" successfully funded from U-Wallet`,
            data: {
                uWalletBalance: updateUWallet.balance,
                forUBalance: updateForU.totalInvestment
            }
        })
    }



    // If payment Method is NOT U-Wallet

    const paymentInformation: IPaymentInformation = {
        user,
        tx_ref,
        amount: depositData.amount,
        currency: "NGN", // Users can only deposit in NGN
        product: "FORU",
        productId: depositData.id
    }

    const paymentLink = await generatePaymentLink(paymentInformation);

    if (paymentLink) {
        
        // Save the generic transaction to the database, holding the type of transaction created
        const newTransaction = await prismaClient.transaction.create({
            data: {
                userId: user.userId,
                amount: paymentInformation.amount,
                transactionReference: tx_ref,
                transactionCurrency: paymentInformation.currency,
                description: "FORU",
                paymentMethod: depositData.paymentMethod,
                transactionType: "DEPOSIT"
            }
        });

        
        // Save the ForU transaction to the database, ...await webhook trigger and subsequently update from webhook data
        const newForUTransaction = await prismaClient.usaveForUTransaction.create({
            data:  {
                amount: depositData.amount,
                transactionType: "DEPOSIT",
                uSaveForUAccountId: depositData.id,
                transactionReference: tx_ref,
                transactionStatus: "PENDING",
                transactionCurrency: "NGN"
            }
        });

        return ResponseHandler.sendSuccessResponse({res,data:paymentLink})
    } else {
        return ResponseHandler.sendErrorResponse({res,error:"Payment link could not be generated"})
    }
})