import { generatePaymentLink } from "../../config/requests";
import { IStartUVestInvestment } from "../../interfaces/bodyInterface";
import { IPaymentInformation } from "../../interfaces/interface";
import prismaClient from "../../prisma/pris-client";
import catchDefaultAsync from "../../utils/catch-async";
import ResponseHandler from "../../utils/response-handler";
import { getConvertedRate } from "../../utils/transactions.util";
import { bcryptCompare, generateTransactionRef } from "../../utils/util";


export const depositIntoMutualFundInvestment = catchDefaultAsync(async (req,res,next)=>{
    const depositData:IStartUVestInvestment = req.body

    const user = req.user

    if(!user){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    const mutualFundCompany = await prismaClient.mutualFundCompanies.findFirst({
        where:{id:depositData.mutualId},
        include:{
            userPortfolios:{
                where:{
                    userId:user.userId
                },
                include:{user:true}
            },
        },
    })
    if(!mutualFundCompany){
        return ResponseHandler.sendErrorResponse({res,error:"Mutual Fund Company not found"})
    }
    //If portfolio is empty , then there is no corresponding investment from user
    if(!mutualFundCompany.userPortfolios.length){
        return ResponseHandler.sendErrorResponse({res,error:"No Investment for this company is found"})
    }

    const userPortfolio = mutualFundCompany.userPortfolios[0]

    const isPinValid = await bcryptCompare({hashedPassword:userPortfolio.user.pin,password:depositData.pin})
    if(!isPinValid){
        return ResponseHandler.sendErrorResponse({res,error:"Entered Pin is Invalid"})
    }

    const tx_ref = generateTransactionRef()
    //get user investment for the specific company

    //get amount in USD or NGN
    const amount = depositData.numberOfUnits * mutualFundCompany.unitPrice

    //g.et converted amount
    const amountToDebit = getConvertedRate({from:mutualFundCompany.currency,to:"NGN",amount})

    if(depositData.paymentMethod === "UWALLET"){
        const userNairaWallet = await prismaClient.uWallet.findFirst({
            where: {
                userId:user.userId,
                currency: "NGN" 
            }
        });
        if (!userNairaWallet) {
            return ResponseHandler.sendErrorResponse({res, error: "No U-Wallet found", code: 400})
        }


        console.log(amountToDebit,"Debit amount")

        if(userNairaWallet.balance < amountToDebit){
            return ResponseHandler.sendErrorResponse({res, error: "Insufficient funds in U-Wallet", code: 400})
        }

        const updatedWallet = await prismaClient.uWallet.update({
            where:{id:userNairaWallet.id},
            data:{
                balance:{decrement:amountToDebit}
            }
        })

        //update balance with actual account        
        const updatedFund = await prismaClient.userMutualFund.update({
            where:{id:userPortfolio.id},
            data:{
                capital:{increment:amount},
                activeBalance:{increment:amount},
                visibleBalance:{increment:amount},
                isActive:true,
            }
        })
        
        
        await prismaClient.transaction.create({
            data: {
                userId:user.userId,
                transactionReference:tx_ref,
                amount: amountToDebit,
                transactionCurrency: userNairaWallet.currency,
                description: "UWALLET",
                paymentMethod: depositData.paymentMethod,
                transactionType: "WITHDRAWAL",
                featureId:userNairaWallet.id
        }})

        await prismaClient.transaction.create({
            data: {
                userId:user.userId,
                transactionReference:tx_ref,
                amount: amount,
                transactionCurrency: mutualFundCompany.currency,
                description:"UVEST",
                paymentMethod: depositData.paymentMethod,
                transactionType:"DEPOSIT",
                featureId:userPortfolio.id
        }})

        return ResponseHandler.sendSuccessResponse({res,
            message:`Successfully deposited ${depositData.numberOfUnits} units into ${mutualFundCompany.companyName}`,
            data:{
                uWalletBalance: updatedWallet.balance,
                totalUnits:(updatedFund.visibleBalance/mutualFundCompany.unitPrice)
            }
        })
    }

    const paymentInformation: IPaymentInformation = {
        user,
        tx_ref,
        amount: amountToDebit,
        currency: "NGN", 
        product:"UVEST",
        productId: mutualFundCompany.id
    }

    const paymentLink = await generatePaymentLink(paymentInformation);

    if (paymentLink) {
        console.log(paymentInformation.amount)
        // Save the generic transaction to the database, holding the type of transaction created
        const newTransaction = await prismaClient.transaction.create({
            data: {
                userId: user.userId,
                amount: paymentInformation.amount,
                transactionReference: tx_ref,
                transactionCurrency: paymentInformation.currency,
                description: "UVEST",
                paymentMethod: depositData.paymentMethod,
                transactionType: "DEPOSIT",
                featureId: userPortfolio.id
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
