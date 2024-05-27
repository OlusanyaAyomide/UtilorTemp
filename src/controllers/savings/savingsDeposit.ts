import catchDefaultAsync from "../../utils/catch-async";
import prismaClient from "../../prisma/pris-client";
import ResponseHandler from "../../utils/response-handler";
import {  IDepositForU, IDepositToMyCabal, IDepositUAndI } from "../../interfaces/bodyInterface";
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
       
        if (uWallet.balance < depositData.amount) {
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
                balance: {decrement: depositData.amount},
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
        console.log(`_____________ ${newTransaction.transactionReference}___________` )

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
        if (uWallet.balance < depositData.amount) {
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
                    totalInvestmentFund:{increment:depositAmount},
                    isActivated:true
              }
            });
        }
        else{
            updatedUAndI = await prismaClient.uANDI.update({
                where: {id: uAndISaving.id},
                data: {
                    partnerCapital:{increment:depositAmount},
                    totalInvestmentFund:{increment:depositAmount},
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
            message: `U And I account "${uAndISaving.Savingsname}" successfully funded from U-Wallet`,
            data: {
                uWalletBalance: updateUWallet.balance,
                UAndIBalance: updatedUAndI.totalInvestmentFund
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


export const depositIntoMyCabalSaving = catchDefaultAsync(async(req, res, next) => {
    const tx_ref = generateTransactionRef();
    const depositData: IDepositToMyCabal = req.body;
    
    const user = req.user;
    // Verify there is indeed a valid user
    if(!user){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    // Check if CabalGroup account is valid
    const cabalGroup = await prismaClient.cabalGroup.findFirst({
        where: {id: depositData.id}
    })


    if (!cabalGroup) {
        return ResponseHandler.sendErrorResponse({res, code: 404, error: "My Cabal Group savings account not found"});
    }

    if(!cabalGroup.hasStarted){
        return ResponseHandler.sendErrorResponse({res,error:"Cabal Group has not started yet"})
    }
    //confirm user is valid to make deposit
    const userCabal =await  prismaClient.userCabal.findFirst({
        where:{
            cabalGroupId:cabalGroup.id,
            userId:user.userId
        }
    })

    if(!userCabal){
        return ResponseHandler.sendErrorResponse({res,error:"User not prsent in Cabal Group"})
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
        const depositAmount = getConvertedRate({amount,from:uWallet.currency,to:cabalGroup.currency})

        // Respond with error if valid wallet has insufficient balance
        if (uWallet.balance < depositData.amount) {
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
                description:"CABAL",
                paymentMethod: depositData.paymentMethod,
                transactionType: "DEPOSIT",
                featureId:userCabal.id
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

        // Update User Cabal Balance
        const upddatedUserCabal = await prismaClient.userCabal.update({
            where:{id:userCabal.id},
            data:{
                totalBalance:{increment:depositAmount},
                cabalCapital:{increment:depositAmount},
            }
        })

        await updateTransactionStatus(newUWalletWithdrawalTransaction.id, "SUCCESS");
        await updateTransactionStatus(newUandITransaction.id, "SUCCESS");


        //create notifications for all cabal users
        const allUsers = await prismaClient.userCabal.findMany({
            where:{cabalGroupId:cabalGroup?.id}
        })

        //create a dashboard notifcation for all user in cabal
        await prismaClient.notification.createMany({
            data:allUsers.map((item)=>{
                return {userId:item.userId,description:`${req.user?.firstName} ${req.user?.lastName} Deposited ${cabalGroup.currency} ${depositAmount} into ${cabalGroup.groupName}`}
            })
        })
        // Return success response
        
        return ResponseHandler.sendSuccessResponse({
            res,
            code: 200,
            message: `CABAL Group "${cabalGroup.groupName}" has been  successfully funded from U-Wallet`,
            data: {
                uWalletBalance: updateUWallet.balance,
                userCabalBalamce: upddatedUserCabal.totalBalance
            }
        })
    }


    // If payment Method is NOT U-Wallet

    const paymentInformation: IPaymentInformation = {
        user,
        tx_ref,
        amount: depositData.amount,
        currency: "NGN", // Users can only deposit in NGN
        product:"CABAL",
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
                description: "CABAL",
                paymentMethod: depositData.paymentMethod,
                transactionType: "DEPOSIT",
                featureId: userCabal.id
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


export const depositIntoEmergencySavings = catchDefaultAsync(async(req, res, next) => {
    const tx_ref = generateTransactionRef();
    const depositData: IDepositForU = req.body;

    const user = req.user;
    // Verify there is indeed a valid user
    if(!user){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    // Check if ForU account is valid
    const emergencyAccount = await prismaClient.emergency.findFirst({
        where: {id: depositData.id}
    })

    if (!emergencyAccount) {
        return ResponseHandler.sendErrorResponse({res, code: 404, error: "ForU savings account not found"});
    }

    //confirm user is allowed to make deposit
    if(emergencyAccount.userId !== req.user?.userId){
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
        const depositAmount = getConvertedRate({amount,from:uWallet.currency,to:emergencyAccount.currency})

        // Respond with error if valid wallet has insufficient balance
       
        if (uWallet.balance < depositData.amount) {
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
                description: "EMERGENCY",
                paymentMethod: depositData.paymentMethod,
                transactionType: "DEPOSIT",
                featureId: emergencyAccount.id
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

        // Add to Emergency Savings
        
        const updateEmergency = await prismaClient.emergency.update({
            where: {id: emergencyAccount.id},
            data: {
                investmentCapital: {increment: depositAmount},
                totalInvestment: {increment:depositAmount},
                isActivated:true
            }
        });


        // Update Generic Transactions status to successful
        await updateTransactionStatus(newUWalletWithdrawalTransaction.id, "SUCCESS");
        await updateTransactionStatus(newForUDepositTransaction.id, "SUCCESS");


        // Return success response
        return ResponseHandler.sendSuccessResponse({
            res,
            code: 200,
            message: `Emergency account "${emergencyAccount.savingsName}" successfully funded from U-Wallet`,
            data: {
                uWalletBalance: updateUWallet.balance,
                forUBalance: updateEmergency.totalInvestment
            }
        })
    }


    // If payment Method is NOT U-Wallet

    const paymentInformation: IPaymentInformation = {
        user,
        tx_ref,
        amount: depositData.amount,
        currency: "NGN", // Users can only deposit in NGN
        product: "EMERGENCY",
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
                description: "EMERGENCY",
                paymentMethod: depositData.paymentMethod,
                transactionType: "DEPOSIT",
                featureId: emergencyAccount.id
            }
        });
        console.log(`_______EMERGENCY______ ${newTransaction.transactionReference}___________` )

        if (!newTransaction) {
            return ResponseHandler.sendErrorResponse({res, error: "Transaction could not be initialized", code: 500})
        }

        return ResponseHandler.sendSuccessResponse({res,data:paymentLink})
    } else {
        return ResponseHandler.sendErrorResponse({res,error:"Payment link could not be generated, Try Again"})
    }
})
