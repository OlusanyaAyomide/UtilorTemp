import { NextFunction,Request,Response } from "express";
import prismaClient from "../../prisma/pris-client";
import ResponseHandler from "../../utils/response-handler";
import { referralAmount } from "../../utils/TempRates";

export async function  updateReferrals(req:Request,res:Response,next:NextFunction){
    const thirtyDaysAgo = new Date();
    const thiryDaysAgoDateTime = new Date(thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30));

    //get users that have used thirty days in app and has made deposit
    const users = await prismaClient.user.findMany({
        where:{
            createdAt:{
                lte:thiryDaysAgoDateTime
            },
            redeemedForSelf:false,
            hasMadeDeposit:true
        },
        include:{uWalletAccounts:true}
    })

    const operations =  users.flatMap((user)=>{
        //if for some reasons user referral balance is less than referral amount do not decrement
        //nor add referall erarning to their wallet
        const userNairaWallet = user.uWalletAccounts.find((wallet => wallet.currency === "NGN"))
        if(userNairaWallet && (userNairaWallet.referralBalance >= referralAmount)){
            //move balance from referral balance to actual balanr
            return[
                prismaClient.uWallet.update({
                    where:{id:userNairaWallet.id},
                    data:{
                        referralBalance:{decrement:referralAmount},
                        balance:{increment:referralAmount}
                    }
                }),
                
                prismaClient.user.update({
                    where:{id:user.id},
                    data:{
                        redeemedForSelf:true
                    }
                })
            ]
        }else{return []}
    })

    return ResponseHandler.sendSuccessResponse({res,message:`Updated ${operations.length} users`,data:users})
}   