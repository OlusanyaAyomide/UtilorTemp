import {  ISendCabalInvitation, IPromoCodeToSaving } from "../../interfaces/bodyInterface"
import prismaClient from "../../prisma/pris-client"
import catchDefaultAsync from "../../utils/catch-async"
import ResponseHandler from "../../utils/response-handler"
import { mailSender } from "../../utils/send-mail"


export const sendMyCabalInvitation = catchDefaultAsync(async(req,res,next)=>{
    const user = req.user
    const cabalData:ISendCabalInvitation = req.body

    if(!user){return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})}

    const cabal = await  prismaClient.cabalGroup.findUnique({
        where:{id:cabalData.cabalId}
    })

    //verify cabal exisst
    if(!cabal){
        return ResponseHandler.sendErrorResponse({res,error:"Cabal was not found"})
    }
    //verify user is admin
    if(cabal.cabalAdminId !== user.userId){
        return ResponseHandler.sendErrorResponse({res,error:"Only Admin can send invitation link"})
    }
    const userDetails = await  prismaClient.user.findFirst({where:{
        merchantID:cabalData.merchantId
    }})
    if(!userDetails){
        return ResponseHandler.sendErrorResponse({res,error:"MerchantId is not valid"})
    }

    //send invitation link to usr
    await mailSender({to:userDetails.email,subject:`${cabal.groupName} Invitation`,body:`Invitation To join ${cabal.groupName}  Cabal Id : ${cabal.id}`,name:userDetails.firstName || ""})

    return ResponseHandler.sendSuccessResponse({res,message:`Invitaion sent to ${userDetails.firstName} ${userDetails.lastName}`})

})


export const JoinMyCabal = catchDefaultAsync(async(req,res,next)=>{
    const user = req.user
    if(!user){return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})}
    const cabalId = req.params.id

    //
    const cabalGroup = await prismaClient.cabalGroup.findFirst({
        where:{
            id:cabalId
        }
    })
    if(!cabalGroup){
        return ResponseHandler.sendErrorResponse({res,error:"Cabal Id is Invalid"})
    }
    const isAlreadyInGroup = await prismaClient.userCabal.findFirst({
        where:{
            cabalGroupId:cabalGroup?.id,
            userId:user.userId    
        }
    })
    if(isAlreadyInGroup){
        return ResponseHandler.sendErrorResponse({res,error:"Already a member of this group"})
    }

    const updatedCabal = await prismaClient.cabalGroup.update({
        where:{id:cabalGroup?.id},
        data:{
            userCabals:{
                create:{
                    userId:user.userId
                }
            }
        }
    })

    //create notifications for all cabal users
    const allUsers = await prismaClient.userCabal.findMany({
        where:{cabalGroupId:cabalGroup?.id}
    })
    //create a dashboard notification for all user in cabal
    await prismaClient.notification.createMany({
        data:allUsers.map((item)=>{
            return {userId:item.userId,description:`${req.user?.firstName} ${req.user?.lastName} has joined ${updatedCabal.groupName}`}
        })
    })

    return ResponseHandler.sendSuccessResponse({res,message:`Succesfully Joined Cabal ${updatedCabal.groupName}`})

})



export const startCabalGroup =catchDefaultAsync(async (req,res,next)=>{
    const {cabalId}:{cabalId:string} = req.body

    const cabalGroup = await prismaClient.cabalGroup.findFirst({
        where:{id:cabalId}
    })
 
    if(!cabalGroup){
        return ResponseHandler.sendErrorResponse({res,error:"Cabal Id is invalid"})
    }

    if(cabalGroup.cabalAdminId !== req.user?.userId){
        return ResponseHandler.sendErrorResponse({res,error:"Only Cabal Admins can start a cabal"})
    }
    const updatedCabal = await prismaClient.cabalGroup.update({
        where:{id:cabalGroup.id},
        data:{hasStarted:true},
    })
    
    return ResponseHandler.sendSuccessResponse({res,message:`${updatedCabal.groupName} has now started`})
    
})


export const addPromoCodeToUsave = catchDefaultAsync(async(req,res,next)=>{
    const bodyData:IPromoCodeToSaving = req.body

    const foru = await prismaClient.uSaveForU.findFirst({
        where:{
            id:bodyData.savingsId
        }
    })
    if(!foru){
        return ResponseHandler.sendErrorResponse({res,error:"Savings Id is invalid"})
    }

    const promoCode = await prismaClient.promoCodes.findFirst({
        where:{
            name:bodyData.promoCode,
            product:"FORU",
            //expiry will be added later but has been skipped for development purposes
        }
    })
    if(!promoCode){
        return ResponseHandler.sendErrorResponse({res,error:"Promo Code invalid or has expired"})
    }

    //create new connection between usave and promoCode
    await prismaClient.uSaveForUPromoCode.create({
        data:{
            usaveForUId:foru.id,
            promoCodeId:promoCode.id   
        }
    })

    return ResponseHandler.sendSuccessResponse({res,message:"Promo Code has been added to U savings"})
})


export const addPromoCodeToEmergency = catchDefaultAsync(async(req,res,next)=>{
    const bodyData:IPromoCodeToSaving = req.body

    const emergency = await prismaClient.emergency.findFirst({
        where:{
            id:bodyData.savingsId
        }
    })
    if(!emergency){
        return ResponseHandler.sendErrorResponse({res,error:"Savings Id is invalid"})
    }

    const promoCode = await prismaClient.promoCodes.findFirst({
        where:{
            name:bodyData.promoCode,
            product:"EMERGENCY",
            //expiry will be added later but has been skipped for development purposes
        }
    })
    if(!promoCode){
        return ResponseHandler.sendErrorResponse({res,error:"Promo Code invalid or has expired"})
    }


    //create new connection between emergency and promoCode
    await prismaClient.uSaveForUPromoCode.create({
        data:{
            usaveForUId:emergency.id,
            promoCodeId:promoCode.id   
        }
    })

    return ResponseHandler.sendSuccessResponse({res,message:"Promo Code has been addeed to Emergency savings"})
})

export const addPromoCodeToUAndI = catchDefaultAsync(async(req,res,next)=>{
    const bodyData:IPromoCodeToSaving = req.body

    const uandi = await prismaClient.uANDI.findFirst({
        where:{
            id:bodyData.savingsId
        }
    })
    if(!uandi){
        return ResponseHandler.sendErrorResponse({res,error:"Savings Id is invalid"})
    }

    const promoCode = await prismaClient.promoCodes.findFirst({
        where:{
            name:bodyData.promoCode,
            product:"UANDI",
            //expiry will be added later but has been skipped for development purposes
        }
    })
    if(!promoCode){
        return ResponseHandler.sendErrorResponse({res,error:"Promo Code invalid or has expired"})
    }

    //create new connection between uAndi and promoCode
    await prismaClient.uSaveForUPromoCode.create({
        data:{
            usaveForUId:uandi.id,
            promoCodeId:promoCode.id   
        }
    })

    return ResponseHandler.sendSuccessResponse({res,message:"Promo Code has been added to UAndI savings"})
})