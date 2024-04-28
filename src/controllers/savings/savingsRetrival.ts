import ResponseHandler from "../../utils/response-handler";
import catchDefaultAsync from "../../utils/catch-async";
import prismaClient from "../../prisma/pris-client";



export const getAllUserForU = catchDefaultAsync(async (req,res,next)=>{
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    const allForU = prismaClient.uSaveForU.findMany({
        where:{userId:userId},
    })

    return ResponseHandler.sendSuccessResponse({res,data:allForU})
})

export const getSingleForU = catchDefaultAsync(async (req,res,next)=>{
    const detail = req.params.id

    if(!detail){
        return ResponseHandler.sendErrorResponse({res,error:"Id is required"})
    }

    const singleForU = await prismaClient.uSaveForU.findFirst({
        where:{id:detail}
    })
    if(!singleForU){
        return ResponseHandler.sendErrorResponse({res,error:"For U Id is invalid"})
    }
    if(singleForU.userId !== req.user?.userId){
        return ResponseHandler.sendErrorResponse({res,error:"Not permitted to view this savings"})
    }

    const transactions = await prismaClient.transaction.findMany({
        where:{
            featureId:singleForU.id
        }
    })
    const data = {...singleForU,transactions}

    return ResponseHandler.sendSuccessResponse({res,data})
})


//get all UandI where the user is either the creator or the partner
export const getAllUserUAndI = catchDefaultAsync(async(req,res,next)=>{
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    const allUAndI = await prismaClient.uANDI.findMany({
        where:{
            OR:[
                {
                    creatorId:userId
                },
                {
                    partnerId:userId
                }
            ]
        },
        orderBy:{
            totalCapital:"desc"
        }
    })
    return ResponseHandler.sendSuccessResponse({res,data:allUAndI})


})