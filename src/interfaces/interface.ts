import { IUserDetail } from "./user-interface"

export interface IPaymentInformation{
    user:IUserDetail
    tx_ref:string
    amount:number
    currency:string
    product: "FORU"|"EMERGENCY"|"UANDI"|"CABAL"
    productId:string
}