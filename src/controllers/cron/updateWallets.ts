import { NextFunction,Request,Response } from "express";
import prismaClient from "../../prisma/pris-client";
import { calculateDailyReturns, generateTransactionRef, getCabalpercentage, getEmergencypercentage, getForUPercentage, getUAndIPercentage } from "../../utils/util";
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



        const allUandIs = await prismaClient.uANDI.findMany({
            where:{isActivated:true},
            include:{
                promoCode:true
            }
        })

        const uandIPercentage = getUAndIPercentage()
        //create new prisma transactions
        //flat multiple array as one with flatMap
        const uandioperations = allUandIs.flatMap((uandIWallet)=>{
            //add promocode percentage to user
            let intrestPercentage = uandIPercentage

            uandIWallet.promoCode.forEach((code)=>{
                intrestPercentage += code.percentageIncrease
            })
            console.log(intrestPercentage,"UANDI")
            
            //update Uand I wallet with new percentage
            const newCreatorReturns = calculateDailyReturns({capital:uandIWallet.creatorCapital,interest:intrestPercentage})
            const newpartnerReturns = calculateDailyReturns({capital:uandIWallet.partnerCapital,interest:intrestPercentage})
            const newTotalCapital = uandIWallet.totalCapital + newCreatorReturns + newpartnerReturns
            const newInvestmentOfReturn = uandIWallet.totalInvestmentReturn + newCreatorReturns + newpartnerReturns
            return[
                prismaClient.uANDI.update({where:{id:uandIWallet.id},
                    data:{
                        creatorInvestmentReturn:newCreatorReturns + uandIWallet.creatorInvestmentReturn,
                        partnerInvestmentReturn:newpartnerReturns + uandIWallet.partnerInvestmentReturn,
                        totalInvestmentReturn:newInvestmentOfReturn,
                        totalCapital:newTotalCapital
                    }
                },     
                ),
                //create two transactions for creator and partner
                prismaClient.transaction.create({
                    data:{
                        transactionReference:generateTransactionRef(),
                        transactionCurrency:uandIWallet.currency,
                        amount:newCreatorReturns + newpartnerReturns,
                        description:"UANDI",
                        featureId:uandIWallet.id,
                        userId:uandIWallet.creatorId,
                        transactionStatus:"SUCCESS",
                        transactionType:"INTEREST",
                        paymentMethod:"UWALLET",
                        note:`${intrestPercentage}% incerease`
                    }
                }),
                prismaClient.transaction.create({
                    data:{
                        transactionReference:generateTransactionRef(),
                        transactionCurrency:uandIWallet.currency,
                        amount:newCreatorReturns + newpartnerReturns,
                        description:"UANDI",
                        featureId:uandIWallet.id,
                        userId:uandIWallet.partnerId,
                        transactionStatus:"SUCCESS",
                        transactionType:"INTEREST",
                        paymentMethod:"UWALLET",
                        note:`${intrestPercentage}% incerease`
                    }
                })
            ]
        })

        //update all emergency wallets simulataneously
        await prismaClient.$transaction(uandioperations)

        //add to all userCabalWWKW
        const allCabals = await prismaClient.cabalGroup.findMany({
            where:{
                hasStarted:true,
            },
            include:{
                userCabals:true
            }
        })
        const allCabalOperations = allCabals.flatMap((cabalGroup)=>{
            const interestPercentage = getCabalpercentage()
            const cabalGroupusers = cabalGroup.userCabals.flatMap((userCabal)=>{
                const dailyInterest = calculateDailyReturns({capital:userCabal.cabalCapital,interest:interestPercentage}) 
                const userCabalTotalInterest = userCabal.cabalRoI + dailyInterest
                const userCabalTotal = userCabal.totalBalance +  dailyInterest
                
                return [
                    prismaClient.userCabal.update({
                        where:{id:userCabal.id},
                        data:{
                            totalBalance:userCabalTotal,
                            cabalRoI:userCabalTotalInterest
                        }
                    }),
                    //create new resulting transaction
                    prismaClient.transaction.create({
                        data:{
                            transactionReference:generateTransactionRef(),
                            transactionCurrency:cabalGroup.currency,
                            amount:dailyInterest,
                            description:"CABAL",
                            featureId:userCabal.id,
                            userId:userCabal.userId,
                            transactionStatus:"SUCCESS",
                            transactionType:"INTEREST",
                            paymentMethod:"UWALLET",
                            note:`${interestPercentage}% incerease`
                        }
                    })
                ]
            })
            return cabalGroupusers
        })
        await prismaClient.$transaction(allCabalOperations)
        
        await prismaClient.cronTracker.update({
            where:{id:cronTracker.id},
            data:{status:"SUCCESS"}
        })
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