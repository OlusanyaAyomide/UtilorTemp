import { ICreateNewUVestFund } from "../../interfaces/bodyInterface";
import prismaClient from "../../prisma/pris-client";
import catchDefaultAsync from "../../utils/catch-async";
import ResponseHandler from "../../utils/response-handler";

export const createNewUvestFund = catchDefaultAsync(async(req,res,next)=>{
    const {historicPerformance,...data}:ICreateNewUVestFund = req.body


    const createdUVestFund = await prismaClient.mutualFundCompanies.create({
        data:{
            historicPerformance:{
                create:historicPerformance.map((item)=>item)
            },
            ...data
        }
    })
    await prismaClient.mutualFundPriceHistory.create({
        data:{
            mutualFundId:createdUVestFund.id,
            returns:data.annualReturns
        }
    })

    return ResponseHandler.sendSuccessResponse({res,message:`New Mutual Fund ${data.companyName} Successfully created`})
})


