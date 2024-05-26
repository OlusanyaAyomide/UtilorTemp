import { NextFunction,Request,Response } from "express";
import prismaClient from "../../prisma/pris-client";
import ResponseHandler from "../../utils/response-handler";

export async function  deletePromoCodes(req:Request,res:Response,next:NextFunction){

    const currentDate = new Date()
    const outdatedCodes = await prismaClient.promoCodes.findMany({
        include:{
            emergencies:true,
            usaveForUs:true,
            uAndIs:true
        }
        // where:{
        //     expiredAt:{
        //         lte: currentDate
        //     }
        // }
    })

    return ResponseHandler.sendSuccessResponse({res,data:outdatedCodes})
}