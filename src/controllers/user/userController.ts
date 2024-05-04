import ResponseHandler from "../../utils/response-handler";
import catchDefaultAsync from "../../utils/catch-async";
import { generateTransactionRef, getTimeFromNow } from "../../utils/util";
import prismaClient from "../../prisma/pris-client";
import { DESCRIPTION_TYPE } from "@prisma/client";

export const createConsentToken = catchDefaultAsync(async (req,res,next)=>{
    const userId = req.user?.userId
    const bodyData:{description:DESCRIPTION_TYPE}= req.body
    if(!userId){
        return ResponseHandler.sendErrorResponse({res,code:500,error:"server error"})
    }
    const futureHour = getTimeFromNow(60)
    const token=generateTransactionRef(16)
    const newToken = await prismaClient.consentToken.create({
      data:{
        userId,token,productDescription:bodyData.description,expiryTime:futureHour
      }  
    })

    return ResponseHandler.sendSuccessResponse({res,data:{
        consentToken:newToken
    }})
    
})

export const retrieveConsentToken = catchDefaultAsync( async(req,res,next)=>{
  const userId = req.user?.userId
  if(!userId){
    return ResponseHandler.sendErrorResponse({res,code:500,error:"server error"})
  }

  const userTokens = await prismaClient.consentToken.findMany({
    where:{userId}
  })

  return ResponseHandler.sendSuccessResponse({res,data:userTokens})

})


export const getUserNotifications = catchDefaultAsync(async (req,res,next)=>{
  const userId = req.user?.userId

  if(!userId){
      return ResponseHandler.sendErrorResponse({res,code:500,error:"server error"})
  }

  const notications = await prismaClient.notification.findMany({
    where:{userId},
    orderBy:{createdAt:"desc"}
  })
  return ResponseHandler.sendSuccessResponse({res,data:notications})
})