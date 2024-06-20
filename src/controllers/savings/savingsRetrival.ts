import ResponseHandler from "../../utils/response-handler";
import catchDefaultAsync from "../../utils/catch-async";
import prismaClient from "../../prisma/pris-client";
import { SavingsArrayData } from "../../interfaces/interface";
import { calculateSavingsPercentage, getCurrentDollarRate } from "../../utils/util";
import { group } from "console";
import calculateInterests, { getFirstDepositDay } from "../../services/transactionServices";



export const getAllUserForU = catchDefaultAsync(async (req,res,next)=>{
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    const allForU = await prismaClient.uSaveForU.findMany({
        where: { userId: userId },
        include: {
          promoCode: {
            select: {
              promoCode: {
                select: {
                  name: true,
                  percentageIncrease: true,
                },
              },
            },
          },
        },
      });

    // Transform the result to put promoCode details into a promoCode array
    const transformedForU = allForU.map(forU => ({
      ...forU,
      promoCode: forU.promoCode.map(pc => pc.promoCode),
    }));

    transformedForU.sort((a, b) => {
        const totalInvestmentA = a.currency === "USD" ? a.totalInvestment * getCurrentDollarRate() : a.totalInvestment;
        const totalInvestmentB = b.currency === "USD" ? b.totalInvestment * getCurrentDollarRate() : b.totalInvestment;
        return totalInvestmentB - totalInvestmentA; // 
    });


    return ResponseHandler.sendSuccessResponse({res,data:transformedForU})
})

export const getSingleForU = catchDefaultAsync(async (req,res,next)=>{
    const detail = req.params.id
    if(!detail){
        return ResponseHandler.sendErrorResponse({res,error:"Id is required"})
    }

    const singleForU = await prismaClient.uSaveForU.findFirst({
        where:{id:detail},
        include: {
            promoCode: {
              select: {
                promoCode: {
                  select: {
                    name: true,
                    percentageIncrease: true,
                  },
                },
              },
            },
          },
    })
    if(!singleForU){
        return ResponseHandler.sendErrorResponse({res,error:"For U Id is invalid"})
    }
    if(singleForU.userId !== req.user?.userId){
        return ResponseHandler.sendErrorResponse({res,error:"Not permitted to view this savings"})
    }

    const transformedForU = {
        ...singleForU,
        promoCode: singleForU.promoCode.map(pc => pc.promoCode),
      };

    const transactions = await prismaClient.transaction.findMany({
        where:{
            featureId:singleForU.id
        }
    })

    
    const data = {...transformedForU,transactions}

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
            totalInvestmentFund:"desc"
        },
        include: {
            promoCode: {
              select: {
                promoCode: {
                  select: {
                    name: true,
                    percentageIncrease: true,
                  },
                },
              },
            },
        },
    })
    const transformedUAndI = allUAndI.map(uAndI => ({
        ...uAndI,
        promoCode: uAndI.promoCode.map(pc => pc.promoCode),
      }));
      transformedUAndI.sort((a, b) => {
        const totalInvestmentA = a.currency === "USD" ? a.totalInvestmentFund * getCurrentDollarRate() : a.totalInvestmentFund;
        const totalInvestmentB = b.currency === "USD" ? b.totalInvestmentFund * getCurrentDollarRate() : b.totalInvestmentFund;
        return totalInvestmentB - totalInvestmentA; // 
    });
    return ResponseHandler.sendSuccessResponse({res,data:transformedUAndI})

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

    const allEmergency =await prismaClient.emergency.findMany({
        where:{userId:userId},
        include: {
            promoCode: {
              select: {
                promoCode: {
                  select: {
                    name: true,
                    percentageIncrease: true,
                  },
                },
              },
            },
          },
    })

    const transformedEmergency = allEmergency.map(emergency => ({
        ...emergency,
        promoCode: emergency.promoCode.map(pc => pc.promoCode),
      }));

      transformedEmergency.sort((a, b) => {
        const totalInvestmentA = a.currency === "USD" ? a.totalInvestment * getCurrentDollarRate() : a.totalInvestment;
        const totalInvestmentB = b.currency === "USD" ? b.totalInvestment * getCurrentDollarRate() : b.totalInvestment;
        return totalInvestmentB - totalInvestmentA; // 
    });

    return ResponseHandler.sendSuccessResponse({res,data:transformedEmergency})
})


export const getSingleEmergency = catchDefaultAsync(async (req,res,next)=>{
    const detail = req.params.id

    if(!detail){
        return ResponseHandler.sendErrorResponse({res,error:"Id is required"})
    }

    const singleEmergency = await prismaClient.emergency.findFirst({
        where:{id:detail},
        include: {
            promoCode: {
              select: {
                promoCode: {
                  select: {
                    name: true,
                    percentageIncrease: true,
                  },
                },
              },
            },
          },
    })
    if(!singleEmergency){
        return ResponseHandler.sendErrorResponse({res,error:"Emergency Id is invalid"})
    }
    
    if(singleEmergency.userId !== req.user?.userId){
        return ResponseHandler.sendErrorResponse({res,error:"Not permitted to view this savings"})
    }

    const transactions = await prismaClient.transaction.findMany({
        where:{
            featureId:singleEmergency.id
        }
    })

    const transformedEmergency = {
        ...singleEmergency,
        promoCode: singleEmergency.promoCode.map(pc => pc.promoCode),
      };
    const data = {...transformedEmergency,transactions}

    return ResponseHandler.sendSuccessResponse({res,data})
})

export const getSingleUANDI = catchDefaultAsync(async(req,res,next)=>{
    const detail = req.params.id

    if(!detail){
        return ResponseHandler.sendErrorResponse({res,error:"Id is required"})
    }

    const singleForU = await prismaClient.uANDI.findFirst({
        where:{id:detail},
        include: {
            promoCode: {
              select: {
                promoCode: {
                  select: {
                    name: true,
                    percentageIncrease: true,
                  },
                },
              },
            },
          },
    })

    if(!singleForU){
        return ResponseHandler.sendErrorResponse({res,error:"Emergency Id is invalid"})
    }
    
    if((singleForU.creatorId !== req.user?.userId) || (singleForU.partnerId !== req.user.userId)){
        return ResponseHandler.sendErrorResponse({res,error:"Not permitted to view this savings"})
    }

    const transactions = await prismaClient.transaction.findMany({
        where:{
            featureId:singleForU.id
        }
    })

    const transformedEmergency = {
        ...singleForU,
        promoCode: singleForU.promoCode.map(pc => pc.promoCode),
      };
    const data = {...transformedEmergency,transactions}

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

export const getSavingsList = catchDefaultAsync(async(req,res,next)=>{
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }
    const forU = await prismaClient.uSaveForU.findMany({
        where:{
            userId:userId
        }
    })
    const emergency = await prismaClient.emergency.findMany({
        where:{
            userId:userId
        }
    })

    const uandI = await prismaClient.uANDI.findMany({
        where:{
            OR:[
                {
                    creatorId:userId
                },
                {
                    partnerId:userId
                }
            ]
        }
    })

    const cabal = await prismaClient.userCabal.findMany({
        where:{
            userId:userId
        },
        include:{
            cabelGroup:true
        }
    })

    const savingsArray:SavingsArrayData[] = []

    forU.forEach((saving)=>{
        const item:SavingsArrayData={
            savingsName:saving.savingsName,
            savingsId:saving.id,
            savingsType:"FORU",
            startDate:saving.createdAt,
            endDate:saving.endingDate,
            percentageCompleted:calculateSavingsPercentage(
                {initial:saving.expectedMonthlyAmount,currentTotal:saving.totalInvestment,startDate:saving.createdAt,endDate:saving.endingDate}
            ),
            monthlySaving:saving.expectedMonthlyAmount,
            currency:saving.currency,
            totalInvestment:saving.totalInvestment,
            iconLink:saving.iconLink
        }
        savingsArray.push(item)
    })

    emergency.forEach((saving)=>{
        const item:SavingsArrayData={
            savingsName:saving.savingsName,
            savingsId:saving.id,
            savingsType:"EMERGENCY",
            startDate:saving.createdAt,
            endDate:saving.endingDate,
            percentageCompleted:calculateSavingsPercentage(
                {initial:saving.expectedMonthlyAmount,currentTotal:saving.totalInvestment,startDate:saving.createdAt,endDate:saving.endingDate}
            ),
            monthlySaving:saving.expectedMonthlyAmount,
            currency:saving.currency,
            totalInvestment:saving.totalInvestment,
            iconLink:saving.iconLink
        }
        savingsArray.push(item)
    })
    
    uandI.forEach((saving)=>{
        const totalUandI = saving.partnerCapital + saving.totalInvestmentFund + saving.totalInvestmentReturn
        const item:SavingsArrayData={
            savingsName:saving.Savingsname,
            savingsId:saving.id, 
            savingsType:"UANDI",
            startDate:saving.createdAt,
            endDate:saving.endingDate,
            percentageCompleted:calculateSavingsPercentage({
                initial:saving.expectedMonthlyAmount,currentTotal:totalUandI,startDate:saving.createdAt,endDate:saving.endingDate
            }) ,
            currency:saving.currency,
            monthlySaving:saving.expectedMonthlyAmount,
            totalInvestment:totalUandI,
            iconLink:saving.iconLink
        }
        savingsArray.push(item)
    })

    cabal.forEach((userCabal)=>{
        const cabalGroup = userCabal.cabelGroup
        const item:SavingsArrayData = {
            savingsName:cabalGroup.groupName,
            savingsId:cabalGroup.id,
            savingsType:"CABAL",
            startDate:cabalGroup.createdAt,
            endDate:cabalGroup.lockedInDate,
            percentageCompleted:null,
            currency:cabalGroup.currency,
            totalInvestment:userCabal.totalBalance,
            monthlySaving:null,
            iconLink:cabalGroup.iconLink
        }
        savingsArray.push(item)
    })
    savingsArray.sort((a, b) => {
        const totalInvestmentA = a.currency === "USD" ? a.totalInvestment * getCurrentDollarRate() : a.totalInvestment;
        const totalInvestmentB = b.currency === "USD" ? b.totalInvestment * getCurrentDollarRate() : b.totalInvestment;
        return totalInvestmentB - totalInvestmentA; // 
    });
    return ResponseHandler.sendSuccessResponse({
        res,data:savingsArray
    })
})

export const getAllSavingsInterest = catchDefaultAsync(async(req,res,next)=>{
    const  durationString = req.query.duration
    const duration = Number(durationString)
    
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    const forus = await prismaClient.transaction.findMany({
        where:{userId,transactionType:"INTEREST",description:"FORU"}
    })
    
    const emergency = await prismaClient.transaction.findMany({
        where:{userId,transactionType:"INTEREST",description:"EMERGENCY"}
    })
    
    const uandI = await prismaClient.transaction.findMany({
        where:{userId,transactionType:"INTEREST",description:"UANDI"}
    })

    const savingsSummary = {
        foru:calculateInterests({transactions:forus,duration}),
        uandI:calculateInterests({transactions:uandI,duration}),
        emergency:calculateInterests({transactions:emergency,duration})
    }
  
    return ResponseHandler.sendSuccessResponse({res,data:savingsSummary})

})

export const getForUSavingsInterest = catchDefaultAsync(async (req,res,next)=>{
    const  durationString = req.query.duration
    const duration = Number(durationString)
    
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    const forus = await prismaClient.transaction.findMany({
        where:{userId,transactionType:"INTEREST",description:"FORU"}
    })
    

    const savingsSummary = {
        foru:calculateInterests({transactions:forus,duration})
    }
  
    return ResponseHandler.sendSuccessResponse({res,data:savingsSummary})
})

export const getEmergencySavingsInterest = catchDefaultAsync(async (req,res,next)=>{
    const  durationString = req.query.duration
    const duration = Number(durationString)
    
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    const emergency = await prismaClient.transaction.findMany({
        where:{userId,transactionType:"INTEREST",description:"EMERGENCY"}
    })
    

    const savingsSummary = {
        emergency:calculateInterests({transactions:emergency,duration})
    }
  
    return ResponseHandler.sendSuccessResponse({res,data:savingsSummary})
})

export const getUAndISavingInterest = catchDefaultAsync(async(req,res,next)=>{
    const  durationString = req.query.duration
    const duration = Number(durationString)
    
    const userId = req.user?.userId 

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    const uAndI = await prismaClient.transaction.findMany({
        where:{userId,transactionType:"INTEREST",description:"UANDI"}
    })
    

    const savingsSummary = {
        uandi:calculateInterests({transactions:uAndI,duration})
    }
  
    return ResponseHandler.sendSuccessResponse({res,data:savingsSummary})
})