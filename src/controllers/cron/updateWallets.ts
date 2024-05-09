import { NextFunction,Request,Response } from "express";
import prismaClient from "../../prisma/pris-client";
import { calculateDailyReturns, generateTransactionRef, getEmergencypercentage, getForUPercentage } from "../../utils/util";
import ResponseHandler from "../../utils/response-handler";

export async function  updateWallets(req:Request,res:Response,next:NextFunction){
    //update all active for
    const cronTracker = await prismaClient.cronTracker.create({
        data:{
            type:"WALLET_UPDATE",
        }
    })
    try{
        const allForU = await prismaClient.uSaveForU.findMany({
            where:{isActivated:true},
            include:{
                promoCode:true
            }
        })
        const forUpercentage = getForUPercentage()
        //create new prisma transactions
        //flat multiple array as one with flatMap
        const operations = allForU.flatMap((forUWallet)=>{
            //add promocode percentage to user
            let intrestPercentage = forUpercentage

            forUWallet.promoCode.forEach((code)=>{
                intrestPercentage += code.percentageIncrease
            })
            console.log(intrestPercentage)
            
            //update wallet with new percentage
            const newReturns = calculateDailyReturns({capital:forUWallet.investmentCapital,interest:intrestPercentage})
            const newTotalReturns = forUWallet.totalInvestment + newReturns
            return[
                prismaClient.uSaveForU.update({where:{id:forUWallet.id},
                    data:{
                        returnOfInvestment:newReturns,
                        totalInvestment:newTotalReturns  
                    }
                },     
                ),
                prismaClient.transaction.create({
                    data:{
                        transactionReference:generateTransactionRef(),
                        transactionCurrency:forUWallet.currency,
                        amount:newReturns,
                        description:"FORU",
                        featureId:forUWallet.id,
                        userId:forUWallet.userId,
                        transactionStatus:"SUCCESS",
                        transactionType:"INTEREST",
                        paymentMethod:"UWALLET",
                        note:`${intrestPercentage}% incerease`
                    }
                })
            ]
        })

        //update all emergency wallets simulataneously
        await prismaClient.$transaction(operations)


        const allEmergency = await prismaClient.emergency.findMany({
            where:{isActivated:true},
            include:{
                promoCode:true
            }
        })
        const emergencypercentage = getEmergencypercentage()
        //create new prisma transactions
        //flat multiple array as one with flatMap
        const emergencyOperations = allEmergency.flatMap((emergencyWallet)=>{
            //add promocode percentage to user
            let intrestPercentage = emergencypercentage

            emergencyWallet.promoCode.forEach((code)=>{
                intrestPercentage += code.percentageIncrease
            })
            console.log(intrestPercentage,"EMERGENCY")
            
            //update wallet with new percentage
            const newReturns = calculateDailyReturns({capital:emergencyWallet.investmentCapital,interest:intrestPercentage})
            const newTotalReturns = emergencyWallet.totalInvestment + newReturns
            return[
                prismaClient.emergency.update({where:{id:emergencyWallet.id},
                    data:{
                        returnOfInvestment:newReturns,
                        totalInvestment:newTotalReturns  
                    }
                },     
                ),
                prismaClient.transaction.create({
                    data:{
                        transactionReference:generateTransactionRef(),
                        transactionCurrency:emergencyWallet.currency,
                        amount:newReturns,
                        description:"EMERGENCY",
                        featureId:emergencyWallet.id,
                        userId:emergencyWallet.userId,
                        transactionStatus:"SUCCESS",
                        transactionType:"INTEREST",
                        paymentMethod:"UWALLET",
                        note:`${intrestPercentage}% incerease`
                    }
                })
            ]
        })

        //update all wallets simulataneously
        await prismaClient.$transaction(emergencyOperations)

        return ResponseHandler.sendSuccessResponse({res,message:"Wallets updated successfuly"})

    }
    catch(err){
        await prismaClient.cronTracker.update({
            where:{id:cronTracker.id},
            data:{
                status:"FAIL"
            }
        })
        return ResponseHandler.sendErrorResponse({res,error:"An error was encountered"})
    }

}