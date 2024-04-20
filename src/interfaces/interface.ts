import { CURRENCY, DESCRIPTION_TYPE } from "@prisma/client"
import { IUserDetail } from "./user-interface"

export interface IPaymentInformation{
    user:IUserDetail
    tx_ref:string
    amount:number
    currency: CURRENCY,
    product: DESCRIPTION_TYPE,
    productId:string
}