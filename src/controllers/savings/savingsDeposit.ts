import catchDefaultAsync from "../../utils/catch-async";
import prismaClient from "../../prisma/pris-client";
import ResponseHandler from "../../utils/response-handler";
import {  IDepositForU, IDepositUAndI } from "../../interfaces/bodyInterface";
import { generateTransactionRef } from "../../utils/util";
import { generatePaymentLink } from "../../config/requests";
import { IPaymentInformation, IUWalletDepositInformation } from "../../interfaces/interface";
import { getConvertedRate, updateTransactionStatus} from "../../utils/transactions.util";
import { UANDI } from "@prisma/client";




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

    //confirm user is allowed to make deposit
    if(forUAccount.userId !== req.user?.userId){
        return ResponseHandler.sendErrorResponse({res,error:"Not allowed to make this forUDeposit"})
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
            return ResponseHandler.sendErrorResponse({res, error: "No U-Wallet found", code: 400})
        }
        //get depositAmount
        const depositAmount = getConvertedRate({amount,from:uWallet.currency,to:forUAccount.currency})

        // Respond with error if valid wallet has insufficient balance
       
        if (uWallet.balance < depositAmount) {
            return ResponseHandler.sendErrorResponse({res, error: "Insufficient funds in U-Wallet", code: 400})
        }

        // Proceed if all else passes

        // initialize  For-U deposit transaction data
        const newForUDepositTransaction = await prismaClient.transaction.create({
            data: {
                userId: user.userId,
                transactionReference: tx_ref,
                amount: depositData.amount,
                transactionCurrency: uWallet.currency,
                description: "FORU",
                paymentMethod: depositData.paymentMethod,
                transactionType: "DEPOSIT",
                featureId: forUAccount.id
            }
        })

        //create a withdrawal transaction in the wallet
        const newUWalletWithdrawalTransaction = await prismaClient.transaction.create({
            data: {
                userId: user.userId,
                transactionReference: tx_ref,
                amount: depositData.amount,
                transactionCurrency: uWallet.currency,
                description: "UWALLET",
                paymentMethod: depositData.paymentMethod,
                transactionType: "WITHDRAWAL",
                featureId: uWallet.id
            }
        })
        
        // Remove from wallet

        const updateUWallet = await prismaClient.uWallet.update({
            where: {id: uWallet.id},
            data: {
                balance: {decrement: depositData.amount}
            }
        });

        // Return error if wallet withdrawal fails
        if (!updateUWallet) {

            // Update Transactions status to failed
            await updateTransactionStatus(newUWalletWithdrawalTransaction.id, "FAIL");
            await updateTransactionStatus(newForUDepositTransaction.id, "FAIL");

            return ResponseHandler.sendErrorResponse({res, code: 500, error: "Could not debit from U-Wallet"});
        }

        // Add to forU
        
        const updateForU = await prismaClient.uSaveForU.update({
            where: {id: forUAccount.id},
            data: {
                investmentCapital: {increment: depositAmount},
                totalInvestment: {increment:depositAmount},
                isActivated:true
            }
        });

        // If for-U update failed
        // i feel this is not needed, tempoary comment for review 
        // if (!updateForU) {

        //     // Update Generic Transactions status to failed
        //     await updateTransactionStatus(newUWalletWithdrawalTransaction.id, "FAIL");
        //     await updateTransactionStatus(newForUDepositTransaction.id, "FAIL");

        //     // Reimburse U-Wallet
        //     await prismaClient.uWallet.update({
        //         where: {id: uWallet.id},
        //         data: {
        //             balance: {increment: amount}
        //         }
        //     });

        //     // Send error response
        //     return ResponseHandler.sendErrorResponse({res, code: 500, error: "Could not credit for-U"});

            
        // }

        // Update Generic Transactions status to successful
        await updateTransactionStatus(newUWalletWithdrawalTransaction.id, "SUCCESS");
        await updateTransactionStatus(newForUDepositTransaction.id, "SUCCESS");


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
                transactionType: "DEPOSIT",
                featureId: forUAccount.id
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



export const depositIntoUANDISavings = catchDefaultAsync(async(req, res, next) => {
    const tx_ref = generateTransactionRef();
    const depositData: IDepositUAndI = req.body;

    const user = req.user;
    // Verify there is indeed a valid user
    if(!user){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    // Check if ForU account is valid
    const uAndISaving = await prismaClient.uANDI.findFirst({
        where: {id: depositData.id}
    })


    if (!uAndISaving) {
        return ResponseHandler.sendErrorResponse({res, code: 404, error: "U And I savings account not found"});
    }

    //confirm user is valid to make deposit
    if((uAndISaving.creatorId !== req.user?.userId) && (uAndISaving.partnerId !== req.user?.userId)){
        return ResponseHandler.sendErrorResponse({res,error:"Not permitted to make deposit"})
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
            return ResponseHandler.sendErrorResponse({res, error: "No U-Wallet found", code: 400})
        }
        const depositAmount = getConvertedRate({amount,from:uWallet.currency,to:uAndISaving.currency})

        // Respond with error if valid wallet has insufficient balance
        if (uWallet.balance < depositAmount) {
            return ResponseHandler.sendErrorResponse({res, error: "Insufficient funds in U-Wallet", code: 400})
        }

        // Proceed if all else passes

        // initialize  For-U deposit transaction data
        const newUandITransaction = await prismaClient.transaction.create({
            data: {
                userId: user.userId,
                transactionReference: tx_ref,
                amount: depositData.amount,
                transactionCurrency: uWallet.currency,
                description: "UANDI",
                paymentMethod: depositData.paymentMethod,
                transactionType: "DEPOSIT",
                featureId: uAndISaving.id
            }
        })

        //create a withdrawal transaction in the wallet
        const newUWalletWithdrawalTransaction = await prismaClient.transaction.create({
            data: {
                userId: user.userId,
                transactionReference: tx_ref,
                amount: depositData.amount,
                transactionCurrency: uWallet.currency,
                description: "UWALLET",
                paymentMethod: depositData.paymentMethod,
                transactionType: "WITHDRAWAL",
                featureId: uWallet.id
            }
        })
        
        // Remove actual value  from wallet

        const updateUWallet = await prismaClient.uWallet.update({
            where: {id: uWallet.id},
            data: {
                balance: {decrement: depositData.amount}
            }
        });

        // Return error if wallet withdrawal fails
        if (!updateUWallet) {

            // Update Transactions status to failed
            await updateTransactionStatus(newUandITransaction.id, "FAIL");
            await updateTransactionStatus(newUWalletWithdrawalTransaction.id, "FAIL");

            return ResponseHandler.sendErrorResponse({res, code: 500, error: "Could not debit from U-Wallet"});
        }

        // Add to UAndI

        
        const isUserCreator = uAndISaving.creatorId === req.user?.userId
        let updatedUAndI:UANDI = uAndISaving
        if(isUserCreator){
            updatedUAndI = await prismaClient.uANDI.update({
                where: {id: uAndISaving.id},
                data: {
                    creatorCapital:{increment:depositAmount},
                    totalCapital:{increment:depositAmount},
                    isActivated:true
              }
            });
        }
        else{
            updatedUAndI = await prismaClient.uANDI.update({
                where: {id: uAndISaving.id},
                data: {
                    partnerCapital:{increment:depositAmount},
                    totalCapital:{increment:depositAmount},
                    isActivated:true
              }
            })
        }

        // Update Generic Transactions status to successful
        await updateTransactionStatus(newUWalletWithdrawalTransaction.id, "SUCCESS");
        await updateTransactionStatus(newUandITransaction.id, "SUCCESS");

        //create notification for both users
        await prismaClient.notification.createMany({
            data:[
                {userId:updatedUAndI.creatorId,description:`${req.user.firstName} ${req.user.lastName} Deposited ${updatedUAndI.currency} ${depositAmount} into ${updatedUAndI.Savingsname} `},
                {userId:updatedUAndI.partnerId,description:`${req.user.firstName} ${req.user.lastName} Deposited ${updatedUAndI.currency} ${depositAmount} into ${updatedUAndI.Savingsname} `}
            ]
        })
        // Return success response
        
        return ResponseHandler.sendSuccessResponse({
            res,
            code: 200,
            message: `For-U account "${uAndISaving.Savingsname}" successfully funded from U-Wallet`,
            data: {
                uWalletBalance: updateUWallet.balance,
                UAndIBalance: updatedUAndI.totalCapital
            }
        })
    }


    // If payment Method is NOT U-Wallet

    const paymentInformation: IPaymentInformation = {
        user,
        tx_ref,
        amount: depositData.amount,
        currency: "NGN", // Users can only deposit in NGN
        product:"UANDI",
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
                description: "UANDI",
                paymentMethod: depositData.paymentMethod,
                transactionType: "DEPOSIT",
                featureId: uAndISaving.id
            }
        });

        console.log(`_____________ ${newTransaction.transactionReference}___________` )
        if (!newTransaction) {
            return ResponseHandler.sendErrorResponse({res, error: "Transaction could not be initialized", code: 500})
        }

        return ResponseHandler.sendSuccessResponse({res,data:paymentLink})
    } else {
        return ResponseHandler.sendErrorResponse({res,error:"Payment link could not be generated"})
    }
})





//shoud be moved into seperate u wallet controller
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
