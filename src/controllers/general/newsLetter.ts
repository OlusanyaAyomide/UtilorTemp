import prismaClient from "../../prisma/pris-client";
import catchDefaultAsync from "../../utils/catch-async";
import { mailChipConfig } from "../../utils/MailChip";
import ResponseHandler from "../../utils/response-handler";

export const SubscribeToNewsLetter = catchDefaultAsync(async(req,res,next)=>{
    const {email}:{email:string} = req.body
    
    const isAlreadySubscribed = await prismaClient.newsLetter.findFirst({
        where:{email}
    })

    const subscriptionStatus = await mailChipConfig({email})

    if(isAlreadySubscribed){
        return ResponseHandler.sendErrorResponse({res,error:"Already Subscribed"})
    }

    if(!subscriptionStatus){
        return ResponseHandler.sendErrorResponse({res,error:"Already Subscribed"})
    }
    await prismaClient.newsLetter.create({
        data:{email}
    })

    return ResponseHandler.sendSuccessResponse({res,data:`${email} added to news letter`})
})

export const retrieveAllSubscribers = catchDefaultAsync(async(req,res,next)=>{
    const allEmails = await prismaClient.newsLetter.findMany()
    return ResponseHandler.sendSuccessResponse({res,data:allEmails})
})

export const unSubscribeFromNewsLetter = catchDefaultAsync(async(req,res,next)=>{
    const {email}:{email:string} = req.body
    const isPresent = await prismaClient.newsLetter.findFirst({
        where:{email}
    })
    if(!isPresent){
        return ResponseHandler.sendErrorResponse({res,error:"Email Not Subscribed"})
    }
    await prismaClient.newsLetter.delete({
        where:{id:isPresent.id}
    })
    return ResponseHandler.sendSuccessResponse({res,message:"Email unsubscribed succesffully"})
})