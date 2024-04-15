import catchDefaultAsync from "../../utils/catch-async";
import prismaClient from "../../prisma/pris-client";
import ResponseHandler from "../../utils/response-handler";
import { ICreateForU } from "../../interfaces/bodyInterface";
import { generateTransactionRef } from "../../utils/util";
import { generatePaymentLink } from "../../config/requests";
import { TransactionType } from "@prisma/client";



export const createNewForUplan = catchDefaultAsync(async(req,res,next)=>{
    const user = req.user
    const forUData:ICreateForU = req.body
    
    if(!user){return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})}
    // const user = await prismaClient.user.findUnique({where:{id:userId}})
    
    //check if is NGN, if NGN  do not divide, otherwise divide capital by current rate
    // const capital = forUData.currency === "NGN"?forUData.amount:(forUData.amount/TempNairaDollar)
// ''
    //create new forU plan which is not activated initially
    //set all funds to zero untill saving is activated and payment is made

    if (forUData.currency == "NGN") {
        if (forUData.amount < 100) {
            return ResponseHandler.sendErrorResponse({res, error: "Deposit amount too little. Minimum of NGN 100", code: 400})
        }
    } else if (forUData.currency == "USD") {
        if (forUData.amount <= 1) {
            return ResponseHandler.sendErrorResponse({res, error: "Deposit amount too little. Minimum of USD 1", code: 400})
        }
    }

    
    const {amount,...rest} = forUData
    const newSaving = await prismaClient.uSaveForU.create({
        data:{
            userId:user.userId,
            investmentCapital:0,
            totalInvestment:0,
            returnOfInvestment:0,
            ...rest
        }
    })


    const tx_ref = generateTransactionRef();
    const paymentLink =await generatePaymentLink({user,tx_ref,amount,currency:forUData.currency,product:"FORU",productId:newSaving.id})
    if(paymentLink){
        
        // Save the generic transaction to the database, holding the type of transaction created
        const newTransaction = await prismaClient.transactionRefs.create ({
            data: {
                userId: user.userId,
                reference: tx_ref,
                description: "FORU"
            }
        })
        // Save the ForU transaction to the database, ...await webhook trigger and subsequently update from webhook data
        const newForUTransaction = await prismaClient.usaveForUTransaction.create({
            data:  {
                amount: forUData.amount,
                transactionType: "DEPOSIT",
                uSaveForUAccountId: newSaving.id,
                transactionRef: tx_ref,
                transactionStatus: "PENDING",
                transactionCurrency: forUData.currency,
                isInitialDeposit: true
            }
        });

        return ResponseHandler.sendSuccessResponse({res,data:paymentLink})
    }
    //if for some reason the id could not be generated , delete the savings and return  a 500 for user to try again
    else{
        await prismaClient.uSaveForU.delete({where:{id:newSaving.id}})
        return ResponseHandler.sendErrorResponse({res,error:"Payment link could not be generated"})
    }
    



})