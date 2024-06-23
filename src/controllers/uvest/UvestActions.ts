import prismaClient from "../../prisma/pris-client"
import catchDefaultAsync from "../../utils/catch-async"
import ResponseHandler from "../../utils/response-handler"

export const updateAnnualReturns = catchDefaultAsync(async (req,res,next)=>{
    const {mutualId,rate}:{mutualId:string,rate:number} = req.body

    const mutualFundCompany = await prismaClient.mutualFundCompanies.findFirst({
        where:{
            id:mutualId
        }
    })
    if(!mutualFundCompany){
        return  ResponseHandler.sendErrorResponse({res,error:"Mutual Fund Company not found"})
    }

    await prismaClient.mutualFundCompanies.update({
        where:{
            id:mutualId
        },
        data:{
            annualReturns:rate
        }
    })
    await prismaClient.mutualFundPriceHistory.create({
        data:{
            mutualFundId:mutualId,
            returns:rate
        }
    })

    return ResponseHandler.sendSuccessResponse({res,message:"Mutual Fund Return Rate has been updated"})
})

export const updateMutualFundUnitPrice = catchDefaultAsync(async (req,res,next)=>{
    const {mutualId,unitPrice} = req.body

    const mutualFundCompany = await prismaClient.mutualFundCompanies.findFirst({
        where:{
            id:mutualId
        }
    })
    if(!mutualFundCompany){
        return  ResponseHandler.sendErrorResponse({res,error:"Mutaul Fund Company not found"})
    }

    await prismaClient.mutualFundCompanies.update({
        where:{
            id:mutualId
        },
        data:{unitPrice}
    })
    return ResponseHandler.sendSuccessResponse({res,message:"Mutual Fund Unit Price has been updated"})
})

export const startMutualFundInvestment = catchDefaultAsync(async (req,res,next)=>{
    const {mutualId}:{mutualId:string} = req.body

    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    const mutualFundCompany = await prismaClient.mutualFundCompanies.findFirst({
        where:{
            id:mutualId
        }
    })

    if(!mutualFundCompany){
        return  ResponseHandler.sendErrorResponse({res,error:"Mutual Fund Company not found"})
    }

    const isAlreadyInvesting = await prismaClient.userMutualFund.findFirst({
        where:{
            mutualFundId:mutualId,
            userId
        }
    })
    if(isAlreadyInvesting){
        return ResponseHandler.sendErrorResponse({res,error:"Active investment found, Fund investment instead"})
    }

    await prismaClient.userMutualFund.create({
        data:{
            mutualFundId:mutualId,
            userId,
        }
    })

    return ResponseHandler.sendSuccessResponse({res,message:`${mutualFundCompany.companyName} Investment has started`})



})