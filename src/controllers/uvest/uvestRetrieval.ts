import { CURRENCY, InvestmentType } from "@prisma/client";
import prismaClient from "../../prisma/pris-client";
import catchDefaultAsync from "../../utils/catch-async";
import ResponseHandler from "../../utils/response-handler";


export const getMutualFundCompanies = catchDefaultAsync(async(req,res,next)=>{
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }
    const  investmentType = req.query.investmentType as InvestmentType | undefined
    const investmentCurrency = req.query.currency as CURRENCY | undefined


    const mutualFunds = await prismaClient.mutualFundCompanies.findMany({
        where:{
            investmentType,
            currency:investmentCurrency,
        }
    })

    return ResponseHandler.sendSuccessResponse({res,data:mutualFunds})
})

export const getIndividualFundCompany = catchDefaultAsync(async(req,res,next)=>{
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }
    
    const mutualFundId = req.params.id

    const mutualFunds = await prismaClient.mutualFundCompanies.findFirst({
        where:{
            id:mutualFundId
        },
        include:{
            priceHistory:{
                orderBy:{
                    createdAt:"desc"
                }
            },
            historicPerformance:true
        }
    })
    if(!mutualFunds){
        return ResponseHandler.sendErrorResponse({res,error:"Mutaul Fund Company not found"})
    }

    return ResponseHandler.sendSuccessResponse({res,data:mutualFunds})
})

export const getUserMutualFundPortFolioDetail = catchDefaultAsync(async(req,res,next)=>{
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }
    const mutualFundId = req.params.id

    const mutualFunds = await prismaClient.mutualFundCompanies.findFirst({
        where:{
            id:mutualFundId
        },
        
    })
    if(!mutualFunds){
        return ResponseHandler.sendErrorResponse({res,error:"Mutaul Fund Company not found"})
    }

    const portfolio = await prismaClient.userMutualFund.findFirst({
        where:{
            mutualFundId,
            userId
        },
        select:{
            visibleBalance:true,
            autoRenew:true,
            isActive:true,
            createdAt:true,
            capital:true
        },
    })
    if(!portfolio){
        return ResponseHandler.sendErrorResponse({res,error:"No active investment for this company"})
    }
    return ResponseHandler.sendSuccessResponse({res,data:{
        ...mutualFunds,portfolio:{...portfolio,unitAmount:portfolio.visibleBalance/mutualFunds.unitPrice}
    }})
})
