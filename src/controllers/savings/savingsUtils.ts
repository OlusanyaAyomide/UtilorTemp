import { IJoinCabal, ISendCabalInvitation } from "../../interfaces/bodyInterface"
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
    //create a dashboard notifcation for all user in cabal
    await prismaClient.notification.createMany({
        data:allUsers.map((item)=>{
            return {userId:item.userId,description:`${req.user?.firstName} ${req.user?.lastName} has joined ${updatedCabal.groupName}`}
        })
    })

    return ResponseHandler.sendSuccessResponse({res,message:`Succesfully Joined Cabal ${updatedCabal.groupName}`})

})