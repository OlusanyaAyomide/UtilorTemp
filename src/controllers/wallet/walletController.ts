import catchDefaultAsync from "../../utils/catch-async";
import ResponseHandler from "../../utils/response-handler";
import prismaClient from "../../prisma/pris-client";

//tempoary balance view, will be extended later
export const getWalletInfo = catchDefaultAsync(async(req,res,next)=>{
    const userId = req.user?.userId 

    const wallet = await prismaClient.uWallet.findFirst({
        where:{userId}
    })
    

    if(!wallet){
        return ResponseHandler.sendErrorResponse({res,error:"Wallet not found"})
        
    }

    const transactions = await prismaClient.transaction.findMany({
        where:{featureId:wallet.id},
        orderBy:{
            createdAt:"desc"
        }
    })
    return ResponseHandler.sendSuccessResponse({res,data:{...wallet,transactions}})

})