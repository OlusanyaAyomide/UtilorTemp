import { ICreatePromoCode } from "../../interfaces/bodyInterface";
import prismaClient from "../../prisma/pris-client";
import catchDefaultAsync from "../../utils/catch-async";
import ResponseHandler from "../../utils/response-handler";

export const createPromoCode = catchDefaultAsync(async(req,res,next)=>{
    const bodyData:ICreatePromoCode = req.body
    
    const isExisting = await prismaClient.promoCodes.findFirst({
        where:{name:bodyData.name}
    }) 
    if(isExisting){
        return ResponseHandler.sendErrorResponse({res,error:"promo Code already existing"})
    }
    const newCode = await prismaClient.promoCodes.create({
        data:{
            percentageIncrease:bodyData.percentage,
            name:bodyData.name,
            product:bodyData.product,
            expiredAt:bodyData.expiredAt,
            revokedAt:bodyData.revokedAt
        },
        select:{
            name:true,
            percentageIncrease:true,
            product:true,
            createdAt:true,
            expiredAt:true,
            revokedAt:true
        }
    })

    return ResponseHandler.sendSuccessResponse({res,message:"promo code created successfully",data:newCode})

})