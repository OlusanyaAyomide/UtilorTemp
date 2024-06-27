import { NextFunction ,Request,Response} from "express";
import prismaClient from "../../prisma/pris-client";
import { calculateDailyReturns, generateTransactionRef } from "../../utils/util";
import ResponseHandler from "../../utils/response-handler";
import {  addDateFrequency, getMidnightISODateTomorrow } from "../../utils/dateUtils";

export async function  updateUvestBalance(req:Request,res:Response,next:NextFunction){
    //update all active for
    const cronTracker = await prismaClient.cronTracker.create({
        data:{
            type:"U_VEST_PORTFOLIO",
        }
    })

    try{
        const allMutualFunds = await prismaClient.mutualFundCompanies.findMany({
            include:{
                userPortfolios:{
                    where:{
                        isActive:true
                    }
                }
            }
        })    
        
        const operations = allMutualFunds.flatMap((mutualFund)=>{
            const  portfolios = mutualFund.userPortfolios.flatMap((portfolio)=>{
                const newReturn = calculateDailyReturns({capital:portfolio.capital,interest:mutualFund.annualReturns})
                const totalBalance = portfolio.activeBalance + newReturn
                const returnOfInvestment = newReturn + portfolio.returnOfInvestment

                return [
                    prismaClient.userMutualFund.update({
                        where:{id:portfolio.id},
                        data:{
                            activeBalance:totalBalance,
                            returnOfInvestment:returnOfInvestment
                        }
                    }),
                    prismaClient.transaction.create({
                        data:{
                            transactionReference:generateTransactionRef(),
                            transactionCurrency:mutualFund.currency,
                            amount:newReturn,
                            description:"FORU",
                            featureId:portfolio.id,
                            userId:portfolio.userId,
                            transactionStatus:"SUCCESS",
                            transactionType:"INTEREST",
                            paymentMethod:"UWALLET",
                        }
                    })
                ]
            })
            return portfolios
        })

        await prismaClient.$transaction(operations)
        return ResponseHandler.sendSuccessResponse({res,message:"Uvest updated successfully"})
    }
    catch(err){
        console.log(err)
        return ResponseHandler.sendErrorResponse({res,error:"An error was encountered",code:500,data:JSON.stringify(err)})
    }

}


export async function  UpdateMutualFundDate(req:Request,res:Response,next:NextFunction){
    const timeAtMidnight = getMidnightISODateTomorrow()
    console.log(timeAtMidnight)
    const retrievedMutualFunds = await prismaClient.mutualFundCompanies.findMany({
        where:{
            nextDividendDate:{
                lte:timeAtMidnight
            }
        },
        include:{
            userPortfolios:true
        }
    })

    const mutualFundDateUpdates = retrievedMutualFunds.map((mutualFund)=>{
        const nextDividendDate = addDateFrequency({date:mutualFund.nextDividendDate,frequency:mutualFund.dividendDuration})  
        return(
            prismaClient.mutualFundCompanies.update({
                where:{id:mutualFund.id},
                data:{
                    nextDividendDate
                }
            })
        )
    })

    //on dividend day , set active balance to visible balance, so units can be updated
    const updatedMutualFund = retrievedMutualFunds.flatMap((mutualFundCompany)=>{
        const updatedPortfolios = mutualFundCompany.userPortfolios.map((portfolio)=>{
            return(
                prismaClient.userMutualFund.update({
                    where:{id:portfolio.id},
                    data:{
                        visibleBalance:portfolio.activeBalance
                    }
                })
            )
        })
        return updatedPortfolios
    })
    
    //update all transactions once
    await prismaClient.$transaction([...updatedMutualFund,...mutualFundDateUpdates])

    return ResponseHandler.sendSuccessResponse({res,data:retrievedMutualFunds})

}