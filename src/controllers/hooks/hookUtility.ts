import { Transaction } from "@prisma/client";
import prismaClient from "../../prisma/pris-client";
import { referralAmount } from "../../utils/TempRates";
import { generateTransactionRef } from "../../utils/util";


export const manageReferralBalance= async(transaction:Transaction)=>{
    
    if (transaction.transactionStatus !== "PENDING") {
        throw new Error("Transaction status has already been modified");
    }
    const depositUser = await prismaClient.user.findFirst({
        where:{id:transaction.userId}
    })
    if(!depositUser){
        throw new Error("User not found in database")
    }
    //if user has previously made deposit skip
    if(!depositUser.hasMadeDeposit){
        //update user status to have made first Deposit
        await prismaClient.user.update({
            where:{id:depositUser.id},
            data:{hasMadeDeposit:true}
        })
        //if referred user is not previously redeemed, since the new user is making a deposit, the referral balance of the referralUser can be moved to balance
        if((!depositUser.redeemedForReferral && depositUser.referredById)){
            const referalId =  depositUser.referredById
            
            //get referrelUser wallet
            const referredByUserWallet = await prismaClient.uWallet.findFirst({
                where:{
                    userId:referalId,currency:"NGN"
                }
            })
            if(!referredByUserWallet){
                throw new Error("Referral user could not be found")
            }

            await prismaClient.user.update({
                where:{id:depositUser.id},
                data:{redeemedForReferral:true}
            })

            //move the refferal balance to balance
            await prismaClient.uWallet.update({
                where:{id:referredByUserWallet.id},
                data:{
                    referralBalance:{decrement:referralAmount},
                    balance:{increment:referralAmount}
                }
            })
            
            const transactionReference = generateTransactionRef()
            //create tranaction for the fund movement
            await prismaClient.transaction.create({
                data:{
                    userId:depositUser.referredById,
                    transactionReference,amount:referralAmount,
                    transactionType:"REFERRAL",
                    paymentMethod:"UWALLET",
                    transactionCurrency:"NGN",
                    transactionStatus:"SUCCESS",                    
                    featureId:referredByUserWallet.id,
                    description:"UWALLET"
                }
            })
            
        }
    }

}

