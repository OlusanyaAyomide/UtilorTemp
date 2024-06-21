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
        return  ResponseHandler.sendErrorResponse({res,error:"Mutaul Fund Company not found"})
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

// export const StartMutaulFundInvestment = catchDefaultAsync(async (req,res,next)=>{
//     const {mutualId}:{mutualId:string} = req.body

//     const userId = req.user?.userId 

//     if(!userId){
//         return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
//     }

//     const mutaulFundCompany = prismaClient.mutualFundCompanies.findFirst({
//         where:{}
//     })

// })