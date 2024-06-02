import prismaClient from "../../prisma/pris-client";
import { WebhookData2 } from "../../interfaces/webhook.interface";
import { CURRENCY, Transaction } from "@prisma/client";
import { getConvertedRate } from "../../utils/transactions.util";

export const depositIntoForUSavingViaFlutterwave = async(dataFromWebhook: WebhookData2, transaction: Transaction) => {
    // Todo: Put all this logic into a try-catch block
    // Todo: Implement the best practices outlined by Flutterwave docs
    const {status} = dataFromWebhook;

    if (transaction.transactionStatus !== "PENDING") {
        throw new Error("Transaction status has already been modified");
    }
    

    //Todo: Re-Verify transaction status from flutterwave as per developer guidelines

    if (status !== "successful") {
        // If failed, update and return
        await prismaClient.transaction.update({
            where: {id: transaction.id},
            data: {
                transactionStatus: "FAIL"
            }
        });

        throw new Error("Flutterwave transaction unsuccessful");
    } else {


    //* Transaction status successful and not modified. We can safely deposit the money

    // Update USaveForUTransaction to be successful
    await prismaClient.transaction.update({
        where: {
            id: transaction.id
        },
        data: {
            transactionStatus: "SUCCESS"
        }
    })

    // Modify the USaveForUAccount as needed

    const uSaveForUAccount = await prismaClient.uSaveForU.findFirst({
        where: {id: transaction.featureId}
    });

    if (!uSaveForUAccount) {
        throw new Error("For-U account not found");
    }

    const depositAmount = getConvertedRate({amount:transaction.amount,from:dataFromWebhook.currency as CURRENCY,to:uSaveForUAccount.currency})
    // let convertedAmount = 0;


    await prismaClient.uSaveForU.update({
        where: {id: transaction.featureId},
        data: {
            investmentCapital: {increment: depositAmount},
            totalInvestment: {increment: depositAmount},
            isActivated:true
        }
    })

    }

}



export const depositIntoUAndISavingViaFlutterwave = async(dataFromWebhook: WebhookData2, transaction: Transaction) => {
    // Todo: Put all this logic into a try-catch block
    // Todo: Implement the best practices outlined by Flutterwave docs
    const {status} = dataFromWebhook;

    if (transaction.transactionStatus !== "PENDING") {
        throw new Error("Transaction status has already been modified");
    }

    //Todo: Re-Verify transaction status from flutterwave as per developer guidelines

    if (status !== "successful") {
        // If failed, update and return
        await prismaClient.transaction.update({
            where: {id: transaction.id},
            data: {
                transactionStatus: "FAIL"
            }
        });

        throw new Error("Flutterwave transaction unsuccessful");
    } else {


    //* Transaction status successful and not modified. We can safely deposit the money

    // Update USaveForUTransaction to be successful
    await prismaClient.transaction.update({
        where: {
            id: transaction.id
        },
        data: {
            transactionStatus: "SUCCESS"
        }
    })

    // Modify the CABAL ACCOUNT as needed

    const uAndISaving = await prismaClient.uANDI.findFirst({
        where: {id: transaction.featureId}
    });

    if (!uAndISaving) {
        throw new Error("For-U account not found");
    }

    const depositAmount = getConvertedRate({amount:transaction.amount,from:transaction.transactionCurrency,to:uAndISaving.currency})
    
    const isCreator = transaction.userId === uAndISaving.creatorId
    if(isCreator){
        await prismaClient.uANDI.update({
            where: {id: uAndISaving.id},
            data: {
                  creatorCapital:{increment:depositAmount},
                  totalInvestmentFund:{increment:depositAmount},
                  isActivated:true
            }
        });
    }else{
        await prismaClient.uANDI.update({
            where: {id: uAndISaving.id},
            data: {
                  partnerCapital:{increment:depositAmount},
                  totalInvestmentFund:{increment:depositAmount},
                  isActivated:true
            }
        });
    }
    //create user notification for both users
    const depositUserInfo = await prismaClient.user.findFirst({where:{id:transaction.userId}})

    await prismaClient.notification.createMany({
        data:[
            {userId:uAndISaving.creatorId,description:`${depositUserInfo?.firstName} ${depositUserInfo?.lastName} Deposited ${uAndISaving.currency} ${depositAmount} into ${uAndISaving.Savingsname}`},

            {userId:uAndISaving.partnerId,description:`${depositUserInfo?.firstName} ${depositUserInfo?.lastName} Deposited ${uAndISaving.currency} ${depositAmount} into ${uAndISaving.Savingsname}`}
        ]
    })
    
    }
}


export const depositIntoMyCabalSavingViaFlutterwave = async(dataFromWebhook: WebhookData2, transaction: Transaction) => {
    // Todo: Put all this logic into a try-catch block
    // Todo: Implement the best practices outlined by Flutterwave docs
    const {status} = dataFromWebhook;

    if (transaction.transactionStatus !== "PENDING") {
        throw new Error("Transaction status has already been modified");
    }

    //Todo: Re-Verify transaction status from flutterwave as per developer guidelines

    if (status !== "successful") {
        // If failed, update and return
        await prismaClient.transaction.update({
            where: {id: transaction.id},
            data: {
                transactionStatus: "FAIL"
            }
        });

        throw new Error("Flutterwave transaction unsuccessful");
    } else {

    //* Transaction status successful and not modified. We can safely deposit the money

    // Update USaveForUTransaction to be successful
    await prismaClient.transaction.update({
        where: {
            id: transaction.id
        },
        data: {
            transactionStatus: "SUCCESS"
        }
    })

    // Modify the USaveForUAccount as needed

    const userCabal = await prismaClient.userCabal.findFirst({
        where: {id: transaction.featureId},
        include:{
            cabelGroup:true,
            user:{
                select:{
                    firstName:true,
                    lastName:true
                }
            }
        }
    });

    if (!userCabal) {
        throw new Error("Cabal Account not found");
    }

    const depositAmount = getConvertedRate({amount:transaction.amount,from:dataFromWebhook.currency as CURRENCY,to:userCabal.cabelGroup.currency})

    await prismaClient.userCabal.update({
        where: {id: transaction.featureId},
        data: {
            cabalCapital: {increment: depositAmount},
            totalBalance: {increment: depositAmount},
        }
    })
    //create notifications for all cabal users
    const allUsers = await prismaClient.userCabal.findMany({
        where:{cabalGroupId:userCabal.cabelGroup?.id}
    })
    //create a dashboard notification for all user in cabal
    await prismaClient.notification.createMany({
        data:allUsers.map((item)=>{
            return {userId:item.userId,description:`${userCabal.user.firstName} ${userCabal.user.lastName} Deposited ${userCabal.cabelGroup.currency} ${depositAmount} into ${userCabal.cabelGroup.groupName}`}
        })
    })

    }
}


export const depositIntoEmeergencySavingViaFlutterwave = async(dataFromWebhook: WebhookData2, transaction: Transaction) => {
    // Todo: Put all this logic into a try-catch block
    // Todo: Implement the best practices outlined by Flutterwave docs
    const {status} = dataFromWebhook;

    if (transaction.transactionStatus !== "PENDING") {
        throw new Error("Transaction status has already been modified");
    }
    

    //Todo: Re-Verify transaction status from flutterwave as per developer guidelines

    if (status !== "successful") {
        // If failed, update and return
        await prismaClient.transaction.update({
            where: {id: transaction.id},
            data: {
                transactionStatus: "FAIL"
            }
        });

        throw new Error("Flutterwave transaction unsuccessful");
    } else {


    //* Transaction status successful and not modified. We can safely deposit the money

    // Update USaveForUTransaction to be successful
    await prismaClient.transaction.update({
        where: {
            id: transaction.id
        },
        data: {
            transactionStatus: "SUCCESS"
        }
    })

    // Modify the EmergencyAccount as needed

    const emergecyAccount = await prismaClient.emergency.findFirst({
        where: {id: transaction.featureId}
    });

    if (!emergecyAccount) {
        throw new Error("For-U account not found");
    }

    const depositAmount = getConvertedRate({amount:transaction.amount,from:dataFromWebhook.currency as CURRENCY,to:emergecyAccount.currency})
    // let convertedAmount = 0;


    await prismaClient.emergency.update({
        where: {id: transaction.featureId},
        data: {
            investmentCapital: {increment: depositAmount},
            totalInvestment: {increment: depositAmount},
            isActivated:true
        }
    })

    }

}




