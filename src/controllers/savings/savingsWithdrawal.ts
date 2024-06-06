import prismaClient from "../../prisma/pris-client";
import catchDefaultAsync from "../../utils/catch-async";
import { getDifferenceInDays, isGreaterThanDay } from "../../utils/dateUtils";
import ResponseHandler from "../../utils/response-handler";
import { getConvertedRate } from "../../utils/transactions.util";
import { generateTransactionRef, getWithdrawalInterest } from "../../utils/util";


export const ForUWithdrawal = catchDefaultAsync(async (req,res,next)=>{
    const userId = req.user?.userId
    const {forUId,amount} :{forUId:string,amount:number} = req.body
    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    //get foru savings and also ensure the savings retirieved is for the user
    const forU = await prismaClient.uSaveForU.findFirst({
        where:{id:forUId,userId}
    })

    if(!forU){
        return ResponseHandler.sendErrorResponse({res,error:"Savings could not be retrieved"})
    }

    const daysFromCreation = getDifferenceInDays(forU.createdAt,(new Date))
    const isDateCompleted = isGreaterThanDay(forU.endingDate)

    // Compare the createdAt date with the date one month ago
    //withdrawals out of foru is only available for users more than 1 month savings
    const isOlderThanAMonth = daysFromCreation > 30
  
    if(!isOlderThanAMonth){
        return ResponseHandler.sendErrorResponse({res,error:"Savings not older than one month"})
    }

    //get user naira uwallet 
    const userWallet = await prismaClient.uWallet.findMany({where:{userId}})
    const userNairaWallet =  userWallet.find((wallet=>wallet.currency === "NGN"))
    if(!userNairaWallet){
        return ResponseHandler.sendErrorResponse({res,error:"Payment wallet can not be processed"})
    }

    let wallet_tx_amount = 0
    let foru_tx_amount = 0


    //for uncompleted investment, capital investment is used

    if(!isDateCompleted){
        if(amount > forU.investmentCapital){
            return ResponseHandler.sendErrorResponse({res,error:"Savings account balance is less than requested balance"})
        }

        //if user is withdrawing all capital,mark savings as completed
        //user can not witdraw investment if savings date is not complete
        const isAllSavingsAmount = forU.investmentCapital === amount        
        await prismaClient.uSaveForU.update({
            where:{id:forU.id},
            data:{
                totalInvestment:{decrement:amount},
                investmentCapital:{decrement:amount},
                isCompleted:isAllSavingsAmount
            }
        })
        
        //convert withdrawal amount to naira
        const convertedRate = getConvertedRate({amount,from:forU.currency,to:"NGN"})
        await prismaClient.uWallet.update(
            {where:{id:userNairaWallet.id},
            data:{
                balance:{increment:convertedRate}
            }
        })
        foru_tx_amount = amount
        wallet_tx_amount = convertedRate
   
    }
    else{
        //if completed use totalInvestment as users now have access to their investment
        //users can withdraw an amount less than their capital and corresponding investment'
        //is then calculated
        if(amount > forU.investmentCapital ){
            return ResponseHandler.sendErrorResponse({res,error:"ForU Savings account balance is less than requested balance"})
        }
        const isAllSavingsAmount = forU.investmentCapital === amount       
        
        //if user is withdrawing partial, get interest similar to withdraw percentage
        const interestOnWithdrawal = isAllSavingsAmount?
            forU.returnOfInvestment:getWithdrawalInterest({capital:forU.investmentCapital,amount,interest:forU.returnOfInvestment})

        await prismaClient.uSaveForU.update({
            where:{id:forUId},
            data:{
                totalInvestment:{decrement:(amount + interestOnWithdrawal)},
                investmentCapital:{decrement:amount},
                returnOfInvestment:{decrement:interestOnWithdrawal},
                isCompleted:isAllSavingsAmount
            }
        })

        //convert before updating naira wallet
        const convertedRate = getConvertedRate({amount,from:forU.currency,to:"NGN"})
        const convertedInterest = getConvertedRate({amount:interestOnWithdrawal,from:forU.currency,to:"NGN"})

        await prismaClient.uWallet.update({
            where:{id:userNairaWallet.id},
            data:{
                balance:{increment:convertedRate + convertedInterest }
            }
        })

        foru_tx_amount = amount + interestOnWithdrawal
        wallet_tx_amount = convertedRate + convertedInterest
    }
    //create corresponding transactions for withdrawal from for u
    await prismaClient.transaction.create({
        data:{
            userId:userId,
            transactionReference:generateTransactionRef(),
            amount:foru_tx_amount,
            transactionCurrency:forU.currency,
            description: "FORU",
            paymentMethod:"UWALLET",
            transactionType: "WITHDRAWAL",
            featureId:forU.id
        }
    })

    //create transaction for uwallet increment
    await prismaClient.transaction.create({
        data:{
            userId:userId,
            transactionReference:generateTransactionRef(),
            amount:wallet_tx_amount,
            transactionCurrency:"NGN",
            description:"UWALLET",
            paymentMethod:"UWALLET",
            transactionType:"SAVING_DEPOSIT",
            featureId:userNairaWallet.id  
        }
    })

    return ResponseHandler.sendSuccessResponse({res,message:`${wallet_tx_amount} has been added to u wallet account`})
})

export const emergencywithdrawal = catchDefaultAsync(async (req,res,next)=>{
    const userId = req.user?.userId
    const {emergencyId,amount} :{emergencyId:string,amount:number} = req.body
    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    //get emergency savings and also ensure the savings retirieved is for the user
    const emergency = await prismaClient.emergency.findFirst({
        where:{id:emergencyId,userId}
    })

    if(!emergency){
        return ResponseHandler.sendErrorResponse({res,error:"Savings could not be retrieved"})
    }

    const daysFromCreation = getDifferenceInDays(emergency.createdAt,(new Date))
    const isDateCompleted = isGreaterThanDay(emergency.endingDate)

    // Compare the createdAt date with the date one month ago
    //withdrawals out of emergency is only available for users more than 1 month savings
    const isOlderThanAMonth = daysFromCreation > 30
  
    if(!isOlderThanAMonth){
        return ResponseHandler.sendErrorResponse({res,error:"Emergency Savings not older than one month"})
    }

    //get user naira uwallet 
    const userWallet = await prismaClient.uWallet.findMany({where:{userId}})
    const userNairaWallet = userWallet.find((wallet=>wallet.currency === "NGN"))
    if(!userNairaWallet){
        return ResponseHandler.sendErrorResponse({res,error:"Payment wallet can not be processed"})
    }

    let wallet_tx_amount = 0
    let emergency_tx_amount = 0


    //for uncompleted investment, capital investment is used

    if(!isDateCompleted){
        if(amount > emergency.investmentCapital){
            return ResponseHandler.sendErrorResponse({res,error:"Savings account balance is less than requested balance"})
        }

        //if user is withdrawing all capital,mark savings as completed
        //user can not witdraw investment if savings date is not complete
        const isAllSavingsAmount = emergency.investmentCapital === amount        
        await prismaClient.emergency.update({
            where:{id:emergency.id},
            data:{
                totalInvestment:{decrement:amount},
                investmentCapital:{decrement:amount},
                isCompleted:isAllSavingsAmount
            }
        })
        
        //convert withdrawal amount to naira
        const convertedRate = getConvertedRate({amount,from:emergency.currency,to:"NGN"})
        await prismaClient.uWallet.update(
            {where:{id:userNairaWallet.id},
            data:{
                balance:{increment:convertedRate}
            }
        })
        emergency_tx_amount = amount
        wallet_tx_amount = convertedRate
   
    }
    else{
        //if completed use totalInvestment as users now have access to their investment
        //users can withdraw an amount less than their capital and corresponding investment'
        //is then calculated
        if(amount > emergency.investmentCapital ){
            return ResponseHandler.sendErrorResponse({res,error:"Savings account balance is less than requested balance"})
        }
        const isAllSavingsAmount = emergency.investmentCapital === amount       
        
        //if user is withdrawing partial, get interest similar to withdraw percentage
        const interestOnWithdrawal = isAllSavingsAmount?
            emergency.returnOfInvestment:getWithdrawalInterest({capital:emergency.investmentCapital,amount,interest:emergency.returnOfInvestment})

        await prismaClient.emergency.update({
            where:{id:emergencyId},
            data:{
                totalInvestment:{decrement:(amount + interestOnWithdrawal)},
                investmentCapital:{decrement:amount},
                returnOfInvestment:{decrement:interestOnWithdrawal},
                isCompleted:isAllSavingsAmount
            }
        })

        //convert before updating naira wallet
        const convertedRate = getConvertedRate({amount,from:emergency.currency,to:"NGN"})
        const convertedInterest = getConvertedRate({amount:interestOnWithdrawal,from:emergency.currency,to:"NGN"})

        await prismaClient.uWallet.update({
            where:{id:userNairaWallet.id},
            data:{
                balance:{increment:convertedRate + convertedInterest }
            }
        })

        emergency_tx_amount = amount + interestOnWithdrawal
        wallet_tx_amount = convertedRate + convertedInterest
    }
    //create corresponding transactions for withdrawal from for u
    await prismaClient.transaction.create({
        data:{
            userId:userId,
            transactionReference:generateTransactionRef(),
            amount:emergency_tx_amount,
            transactionCurrency:emergency.currency,
            description:"EMERGENCY",
            paymentMethod:"UWALLET",
            transactionType: "WITHDRAWAL",
            featureId:emergency.id
        }
    })

    //create transaction for uwallet increment
    await prismaClient.transaction.create({
        data:{
            userId:userId,
            transactionReference:generateTransactionRef(),
            amount:wallet_tx_amount,
            transactionCurrency:"NGN",
            description:"UWALLET",
            paymentMethod:"UWALLET",
            transactionType:"SAVING_DEPOSIT",
            featureId:userNairaWallet.id  
        }
    })

    return ResponseHandler.sendSuccessResponse({res,message:`${wallet_tx_amount} has been added to u wallet account`})
})


export const uAndIWithdrawal = catchDefaultAsync(async(req,res,next)=>{
    const {uAndIId,amount} :{uAndIId:string,amount:number} = req.body
    const userId = req.user?.userId
    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }
    const uAndI = await prismaClient.uANDI.findFirst({
        where:{
            id:uAndIId,
            OR:[
                {creatorId:userId},
                {partnerId:userId}
            ]   
        }
    })
    if(!uAndI){
        return ResponseHandler.sendErrorResponse({res,error:"U And I Saving Account not found"})
    }

    const isCreator = uAndI.creatorId === userId

    //get user naira uwallet 
    const userWallet = await prismaClient.uWallet.findMany({where:{userId}})
    const userNairaWallet = userWallet.find((wallet=>wallet.currency === "NGN"))
    if(!userNairaWallet){
        return ResponseHandler.sendErrorResponse({res,error:"Payment wallet can not be processed"})
    }

    // Compare the createdAt date with the date one month ago
  

    const daysFromCreation = getDifferenceInDays(uAndI.createdAt,(new Date))
    const isDateCompleted = isGreaterThanDay(uAndI.endingDate)

    const isOlderThanAMonth = daysFromCreation > 30

    if(!isOlderThanAMonth){
        return ResponseHandler.sendErrorResponse({res,error:"U And I Savings not older than one month"})
    }
    
    let wallet_tx_amount = 0
    let uAndI_tx_amount = 0
    
    //withdrawals out of uAndI is only available for users more than 1 month savings

    if(isCreator){
        if(!isDateCompleted){
            if(amount > uAndI.creatorCapital){
                return ResponseHandler.sendErrorResponse({res,error:"U And I Savings account balance is less than requested balance"})
            }
    
            //if user is withdrawing all capital,mark savings as completed
            //user can not witdraw investment if savings date is not complete
            const isAllSavingsAmount = (uAndI.creatorCapital === amount ) && (uAndI.partnerCapital  === 0)      
            await prismaClient.uANDI.update({
                where:{id:uAndI.id},
                data:{
                    totalInvestmentFund:{decrement:amount},
                    creatorCapital:{decrement:amount},
                    isCompleted:isAllSavingsAmount
                }
            })
            
            //convert withdrawal amount to naira
            const convertedRate = getConvertedRate({amount,from:uAndI.currency,to:"NGN"})
            await prismaClient.uWallet.update(
                {where:{id:userNairaWallet.id},
                data:{
                    balance:{increment:convertedRate}
                }
            })
            uAndI_tx_amount = amount
            wallet_tx_amount = convertedRate
       
        }
        else{
            //if completed use totalInvestment as users now have access to their investment
            //users can withdraw an amount less than their capital and corresponding investment'
            //is then calculated
            if(amount > uAndI.creatorCapital ){
                return ResponseHandler.sendErrorResponse({res,error:"U and I Savings account balance is less than requested balance"})
            }
            const isAllSavingsAmount = (uAndI.creatorCapital === amount) && (uAndI.partnerCapital === 0)       
            
            //if user is withdrawing partial, get interest similar to withdraw percentage
            const interestOnWithdrawal = isAllSavingsAmount?
                uAndI.creatorInvestmentReturn:getWithdrawalInterest({capital:uAndI.creatorCapital,amount,interest:uAndI.creatorInvestmentReturn})
            
            await prismaClient.uANDI.update({
                where:{id:uAndIId},
                data:{
                    totalInvestmentFund:{decrement:(amount + interestOnWithdrawal)},
                    creatorCapital:{decrement:amount},
                    creatorInvestmentReturn:{decrement:interestOnWithdrawal},  
                    isCompleted:isAllSavingsAmount,
                    totalInvestmentReturn:{decrement:interestOnWithdrawal}              }
            })
            const convertedRate = getConvertedRate({amount,from:uAndI.currency,to:"NGN"})
            const convertedInterest = getConvertedRate({amount:interestOnWithdrawal,from:uAndI.currency,to:"NGN"})

            await prismaClient.uWallet.update(
                {where:{id:userNairaWallet.id},
                data:{
                    balance:{increment:(convertedRate + convertedInterest)}
                }
            })

            uAndI_tx_amount = amount
            wallet_tx_amount =  convertedRate + convertedInterest
        }
    }else{
        if(!isDateCompleted){
            if(amount > uAndI.partnerCapital){
                return ResponseHandler.sendErrorResponse({res,error:"U And I Savings account balance is less than requested balance"})
            }
    
            //if user is withdrawing all capital,mark savings as completed
            //user can not witdraw investment if savings date is not complete
            const isAllSavingsAmount = (uAndI.partnerCapital === amount ) && (uAndI.creatorCapital  === 0)      
            await prismaClient.uANDI.update({
                where:{id:uAndI.id},
                data:{
                    totalInvestmentFund:{decrement:amount},
                    partnerCapital:{decrement:amount},
                    isCompleted:isAllSavingsAmount
                }
            })
            
            //convert withdrawal amount to naira
            const convertedRate = getConvertedRate({amount,from:uAndI.currency,to:"NGN"})
            await prismaClient.uWallet.update(
                {where:{id:userNairaWallet.id},
                data:{
                    balance:{increment:convertedRate}
                }
            })
            uAndI_tx_amount = amount
            wallet_tx_amount = convertedRate 
       
        }
        else{
            //if completed use totalInvestment as users now have access to their investment
            //users can withdraw an amount less than their capital and corresponding investment'
            //is then calculated
            if(amount > uAndI.partnerCapital ){
                return ResponseHandler.sendErrorResponse({res,error:"U and I Savings account balance is less than requested balance"})
            }
            const isAllSavingsAmount = (uAndI.partnerCapital === amount) && (uAndI.creatorCapital === 0)       
            
            //if user is withdrawing partial, get interest similar to withdraw percentage
            const interestOnWithdrawal = isAllSavingsAmount?
                uAndI.partnerInvestmentReturn:getWithdrawalInterest({capital:uAndI.partnerCapital,amount,interest:uAndI.partnerInvestmentReturn})
    
            await prismaClient.uANDI.update({
                where:{id:uAndIId},
                data:{
                    totalInvestmentFund:{decrement:(amount + interestOnWithdrawal)},
                    partnerCapital:{decrement:amount},
                    partnerInvestmentReturn:{decrement:interestOnWithdrawal},  
                    isCompleted:isAllSavingsAmount,
                    totalInvestmentReturn:{decrement:interestOnWithdrawal}              }
            })

            const convertedRate = getConvertedRate({amount,from:uAndI.currency,to:"NGN"})
            const convertedInterest = getConvertedRate({amount:interestOnWithdrawal,from:uAndI.currency,to:"NGN"})

            await prismaClient.uWallet.update(
                {where:{id:userNairaWallet.id},
                data:{
                    balance:{increment:(convertedRate + convertedInterest)}
                }
            })

            uAndI_tx_amount = amount
            wallet_tx_amount =  convertedRate + convertedInterest
        }
    }
    // const convertedRate = getConvertedRate({amount,from:uAndI.currency,to:"NGN"})
    // const convertedInterest = getConvertedRate({amount:interestOnWithdrawal,from:emergency.currency,to:"NGN"})
    //create corresponding transactions for withdrawal from for u
    await prismaClient.transaction.create({
        data:{
            userId:userId,
            transactionReference:generateTransactionRef(),
            amount:uAndI_tx_amount,
            transactionCurrency:uAndI.currency,
            description:"UANDI",
            paymentMethod:"UWALLET",
            transactionType: "WITHDRAWAL",  
            featureId:uAndI.id
        }
    })

    //create transaction for uwallet increment
    await prismaClient.transaction.create({
        data:{
            userId:userId,
            transactionReference:generateTransactionRef(),
            amount:wallet_tx_amount,
            transactionCurrency:"NGN",
            description:"UWALLET",
            paymentMethod:"UWALLET",
            transactionType:"SAVING_DEPOSIT",
            featureId:userNairaWallet.id  
        }
    })
    await prismaClient.notification.createMany({
        data:[
            {userId:uAndI.creatorId,description:`${req.user?.firstName} ${req.user?.lastName} Withdrawed ${uAndI.currency} ${uAndI_tx_amount} from ${uAndI.Savingsname} `},
            {userId:uAndI.partnerId,description:`${req.user?.firstName} ${req.user?.lastName} Withdrawed ${uAndI.currency} ${uAndI_tx_amount} from ${uAndI.Savingsname} `},
        ]
    })
    return ResponseHandler.sendSuccessResponse({res,message:`${wallet_tx_amount} has been added to u wallet account`})
})
