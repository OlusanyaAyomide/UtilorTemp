import prismaClient from "../../prisma/pris-client";
import catchDefaultAsync from "../../utils/catch-async";
import ResponseHandler from "../../utils/response-handler";


export const getAllMutualFundDetails = catchDefaultAsync(async (req,res,next)=>{
    const allMutualFunds = await prismaClient.mutualFundCompanies.findMany({
        include:{
            userPortfolios:true
        }
    })
    return ResponseHandler.sendSuccessResponse({res,data:allMutualFunds})
})