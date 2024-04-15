import prismaClient from "../../prisma/pris-client";
import catchDefaultAsync from "../../utils/catch-async";
import ResponseHandler from "../../utils/response-handler";

export const  createNewSaving=catchDefaultAsync(async(req,res,next)=>{
    console.log(req.body);

    // Todo: Verify webhook payload comes from Flutterwave using the secret hash set in the Flutterwave Settings
    
    // Cast webhook data to appropriate type
    const dataFromWebhook: WebhookData = req.body;

    // Retrieve transaction reference and transaction status
    const {tx_ref, status} = dataFromWebhook.data
    // let tx_ref = dataFromWebhook.data.tx_ref;
    // // Retrieve transaction status
    // let tx_status = dataFromWebhook.data.status;

    const transaction = await prismaClient.transactionRefs.findFirst({
        where: {reference: tx_ref}
    })

    if (!transaction) {
        return ResponseHandler.sendErrorResponse({res, error: "Transaction not found", code: 404})
    }

    // Modify database based on transaction description

    // Todo: Implement the best practices outlined by Flutterwave docs
    switch (transaction.description) {
        case "FORU":
            // If payload returned from flutterwave indicates an unsuccessful transaction
            if (status !== "successful") {
                return ResponseHandler.sendErrorResponse({res, error: "Transaction failed", code: 409 })
            }

            //Todo: If status is successful, Re-Verify from flutterwave as per developer guidelines
            
            // Search for the ForU transaction in the database
            const uSaveForUTransaction = await prismaClient.usaveForUTransaction.findFirst({
                where: {transactionRef: tx_ref}
            });

            // Return error if not found
            if (!uSaveForUTransaction) {
                return ResponseHandler.sendErrorResponse({res, code: 404, error: "No corresponding For-U trnasaction found"})
            }

            // Return error if already modified to avoid double deposit and any other potential glitches
            if (uSaveForUTransaction.transactionStatus !== "PENDING") {
                return ResponseHandler.sendErrorResponse({res, error: "Transaction status already modified", code: 409 })
            }

            //* Transaction status successful, uSaveForUTransaction not modified. We can safely deposit the money

            // Update USaveForUTransaction to be successful
            await prismaClient.usaveForUTransaction.update({
                where: {
                    id: uSaveForUTransaction.id
                },
                data: {
                    transactionStatus: "SUCCESS"
                }
            })

            // Modify the USaveForUAccountAsRequired
            switch (uSaveForUTransaction.isInitialDeposit) {
                case true:
                    await prismaClient.uSaveForU.update({
                        where: {id: uSaveForUTransaction.uSaveForUAccountId},
                        data: {
                            investmentCapital: {increment: uSaveForUTransaction.amount},
                            totalInvestment: {increment: uSaveForUTransaction.amount}
                        }
                    })
                    break;
                case false:
                    await prismaClient.uSaveForU.update({
                        where: {id: uSaveForUTransaction.uSaveForUAccountId},
                        data: {
                            totalInvestment: {increment: uSaveForUTransaction.amount}
                        }
                    })
                    break;
                default:
                    break;
            }
            break;


        default:
            break;
    }

    
    
    return ResponseHandler.sendSuccessResponse({res})
})

interface WebhookData {
    event: string // 'charge.completed',
    data: {
        id: number // 5029538,
        tx_ref: string // '7mXzxtwo0R3g1Y',
        flw_ref: string //'FLW-MOCK-86e938f440b355bb21755432ebd07c76',
        device_fingerprint: string // 'N/A',
        amount: number // 9000,
        currency: string // 'NGN',
        charged_amount: number // 9000,
        app_fee: number // 126,
        merchant_fee: number //0,
        processor_response: string // 'successful',
        auth_model: string //'PIN',
        ip: string // '52.209.154.143',
        narration: string // 'CARD Transaction ',
        status: string // 'successful',
        payment_type: string // 'card',
        created_at: string // '2024-04-15T16:54:34.000Z',
        account_id: number // 1956216,
        customer: {
            id: number // 2391429,
            name: string // 'undefined undefined',
            phone_number: string | null //null,
            email: string // 'onotaizee@gmail.com',
            created_at: string // '2024-04-15T16:54:34.000Z'
        },
        card: {
            first_6digits: string // '553188',
            last_4digits: string // '2950',
            issuer:string // 'MASTERCARD  CREDIT',
            country: string // 'NG',
            type: string // 'MASTERCARD',
            expiry: string // '09/32'
        }
    },
    'event.type': string //'CARD_TRANSACTION'
}