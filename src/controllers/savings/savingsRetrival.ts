import ResponseHandler from "../../utils/response-handler";
import catchDefaultAsync from "../../utils/catch-async";
import prismaClient from "../../prisma/pris-client";



export const getAllUserForU = catchDefaultAsync(async (req,res,next)=>{
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    const allForU =await prismaClient.uSaveForU.findMany({
        where:{userId:userId},
        include:{
            promoCode:{
                select:{
                    name:true,
                    percentageIncrease:true
                }
            }
        }
    })

    return ResponseHandler.sendSuccessResponse({res,data:allForU})
})

export const getSingleForU = catchDefaultAsync(async (req,res,next)=>{
    const detail = req.params.id

    if(!detail){
        return ResponseHandler.sendErrorResponse({res,error:"Id is required"})
    }

    const singleForU = await prismaClient.uSaveForU.findFirst({
        where:{id:detail},
        include:{
            promoCode:{
                select:{
                    name:true,
                    percentageIncrease:true
                }
            }
        }
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
        },
        include:{
            promoCode:{
                select:{
                    name:true,
                    percentageIncrease:true
                }
            }
        }
    })
    return ResponseHandler.sendSuccessResponse({res,data:allUAndI})

})



//returns all user in a cabal
export const getAllCabalUsers = catchDefaultAsync(async(req,res,next)=>{
    const userId = req.user?.userId 
    const cabalId = req.params.id
    if(!cabalId){
        return ResponseHandler.sendErrorResponse({res,error:"Cabal Id is required",code:500})
    }
    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }
    
    const isAMember = await prismaClient.userCabal.findFirst({
        where:{
            cabalGroupId:cabalId,
            userId:userId
        }
    })
    //only allow members to read cabal data
    if(!isAMember){
        return ResponseHandler.sendErrorResponse({res,error:"Unauthorized to view this information"})
    }

    //get all users in a cabal group
    const allUsers = await prismaClient.cabalGroup.findFirst({where:{id:cabalId},
        include:{
            userCabals:{
                include:{
                    user:{
                        select:{
                            firstName:true,
                            email:true,
                            lastName:true,

                        }
                    }
                },
                orderBy:{
                    totalBalance:"desc"
                }
            }
        }
    })

    return ResponseHandler.sendSuccessResponse({res,data:allUsers})
})



export const getAllUserEmergency = catchDefaultAsync(async (req,res,next)=>{
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    const allForU =await prismaClient.emergency.findMany({
        where:{userId:userId},
        include:{
            promoCode:{
                select:{
                    name:true,
                    percentageIncrease:true
                }
            }
        }
    })

    return ResponseHandler.sendSuccessResponse({res,data:allForU})
})


export const getSingleEmergency = catchDefaultAsync(async (req,res,next)=>{
    const detail = req.params.id

    if(!detail){
        return ResponseHandler.sendErrorResponse({res,error:"Id is required"})
    }

    const singleEmergency = await prismaClient.emergency.findFirst({
        where:{id:detail},
        include:{
            promoCode:{
                select:{
                    name:true,
                    percentageIncrease:true
                }
            }
        }
    })
    if(!singleEmergency){
        return ResponseHandler.sendErrorResponse({res,error:"For U Id is invalid"})
    }
    if(singleEmergency.userId !== req.user?.userId){
        return ResponseHandler.sendErrorResponse({res,error:"Not permitted to view this savings"})
    }

    const transactions = await prismaClient.transaction.findMany({
        where:{
            featureId:singleEmergency.id
        }
    })
    const data = {...singleEmergency,transactions}

    return ResponseHandler.sendSuccessResponse({res,data})
})

export const getAllSavingsData = catchDefaultAsync(async(req,res,next)=>{

    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }
    let totalForUNairaBalance:number = 0
    let totalForUDollarbalaance:number = 0
    const allForus = await prismaClient.uSaveForU.findMany({
        where:{userId}
    })
    allForus.forEach((foru)=>{
        if(foru.currency === "NGN"){totalForUNairaBalance += foru.totalInvestment}
        else{totalForUDollarbalaance += foru.totalInvestment}
    })

    let totalEmergencyNairaBalance:number = 0
    let totalEmergencyDollarBalance:number = 0

    const allEmergency = await prismaClient.emergency.findMany({
        where:{userId}
    })
    allEmergency.forEach((emergency)=>{
        if(emergency.currency === "NGN"){totalEmergencyNairaBalance += emergency.totalInvestment}
        else{totalEmergencyDollarBalance += emergency.totalInvestment}
    })

    let totalUAndINairaBalance:number = 0
    let totalUAndIDollarBalance:number = 0

    const allUandI = await prismaClient.uANDI.findMany({
        where:{OR:[
            {creatorId:userId},
            {partnerId:userId}
        ]}
    })

    allUandI.forEach((uandI)=>{
        if(uandI.currency === "NGN"){
            if(uandI.creatorId === userId){
                totalUAndINairaBalance += (uandI.creatorCapital + uandI.creatorInvestmentReturn)
            }else{
                totalUAndINairaBalance += (uandI.partnerCapital + uandI.partnerInvestmentReturn)
            }
        }else{
            if(uandI.creatorId === userId){
                totalUAndIDollarBalance +=  (uandI.creatorCapital + uandI.creatorInvestmentReturn)
            }else{
                totalUAndIDollarBalance += (uandI.partnerCapital + uandI.partnerInvestmentReturn)
            }
        }
    })
    
    let totalUserNairaCabal : number = 0
    let totalUserDollarCabal : number = 0

    const allUserCabal = await prismaClient.userCabal.findMany({
        where:{userId},
        include:{
            cabelGroup:true
        }
    })
    allUserCabal.forEach((cabal)=>{
        if(cabal.cabelGroup.currency === "NGN"){
            totalUserNairaCabal += cabal.totalBalance
        }else{
            totalUserDollarCabal += cabal.totalBalance
        }
    })

    const savingsSummary = {
        forU:{
            NGN:totalForUNairaBalance,
            USD:totalForUDollarbalaance
        },
        uAndI:{
            NGN:totalUAndINairaBalance,
            USD:totalUAndIDollarBalance
        },
        emergency:{
            NGN:totalEmergencyNairaBalance,
            USD:totalEmergencyDollarBalance
        },
        cabals:{
            NGN:totalUserNairaCabal,
            USD:totalUserDollarCabal,
        },
        total:{
            NGN:totalForUNairaBalance+totalUAndINairaBalance+totalEmergencyNairaBalance+totalUserNairaCabal,
            USD:totalForUDollarbalaance+totalUAndIDollarBalance+totalEmergencyDollarBalance+totalUserDollarCabal
        }
    }

    return ResponseHandler.sendSuccessResponse({res,data:savingsSummary})
})