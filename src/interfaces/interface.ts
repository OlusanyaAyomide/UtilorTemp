import { CURRENCY, DESCRIPTION_TYPE, PAYMENT_METHOD } from "@prisma/client"
import { IUserDetail } from "./user-interface"

export interface IPaymentInformation{
    user:IUserDetail
    tx_ref:string
    amount:number
    currency: CURRENCY,
    product: DESCRIPTION_TYPE,
    productId:string
}


export interface IUWalletDepositInformation{
    id:string
    amount:number
    paymentMethod: PAYMENT_METHOD,
    currency: CURRENCY
}