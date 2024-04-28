import { ICreateForU, ICreateUandI } from "../../interfaces/bodyInterface";
import catchDefaultAsync from "../../utils/catch-async";
import ResponseHandler from "../../utils/response-handler";
import prismaClient from "../../prisma/pris-client";


export const createNewForUplan = catchDefaultAsync(async(req,res,next)=>{
    const user = req.user;
    const forUData:ICreateForU = req.body;

    const now = new Date();
    const ending = new Date(forUData.endingDate);

    // Prevent from setting ending date in the past;
    if (now >= ending) {
        return ResponseHandler.sendErrorResponse({res, error: "Ending date must be in the future", code: 400});
    }
    
    if(!user){return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})}
    
    const {...rest} = forUData
    const newSaving = await prismaClient.uSaveForU.create({
        data:{
            userId:user.userId,
            investmentCapital:0,
            totalInvestment:0,
            returnOfInvestment:0,
            ...rest
        }
    });

    const data = {
        savingId:newSaving.id,
        savingName:newSaving.savingsName,
        currency:newSaving.currency
    }
    
    return ResponseHandler.sendSuccessResponse({res, code: 200, message: `ForU savings "${forUData.savingsName}" created successfully`, data});

})



export const createNewUAndISavings = catchDefaultAsync(async(req,res,next)=>{
    const user = req.user
    const uAndIData:ICreateUandI = req.body
 
    const now = new Date();
    const ending = new Date(uAndIData.endingDate);

    //get consent token object and ensure token received is not for user
    const tokenObject = await prismaClient.consentToken.findFirst({
        where:{token:uAndIData.consentToken,
            userId:{
                not:req.user?.userId
            },
            expiryTime:{
            gt:new Date()
        }},
        include:{user:true}
    })
    if(!tokenObject){
        return ResponseHandler.sendErrorResponse({res,error:"Consent Token is not valid"})
    }

    //get saving parner from token object
    const partner = tokenObject.user
    
    // Prevent from setting ending date in the past;
    if (now >= ending) {
        return ResponseHandler.sendErrorResponse({res, error: "Ending date must be in the future", code: 400});
    }

    if(!user){return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})}

    //crete  a new youAndISavng

    const newUandISaving = await prismaClient.uANDI.create({
        data:{
            creatorId:user.userId,
            partnerId:partner.id,
            Savingsname:uAndIData.savingsName,
            currency:uAndIData.currency,
            expectedDepositDay:uAndIData.expectedDepositDay,
            expectedMonthlyAmount:uAndIData.expectedMonthlyAmount,   
            endingDate:uAndIData.endingDate
        }
    })

    const data = {
        savingId:newUandISaving.id,
        savingName:newUandISaving.Savingsname,
        currency:newUandISaving.currency
    }

    return ResponseHandler.sendSuccessResponse({res, code: 200, message: `You And I savings "${newUandISaving.Savingsname}" created successfully`, data});


})