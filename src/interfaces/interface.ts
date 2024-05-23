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

export interface SavingsArrayData {
    savingsId:string
    savingsName:string,
    percentageCompleted:number | null
    startDate:Date,
    endDate:Date
    monthlySaving:number | null,
    totalInvestment:number,
    savingsType:DESCRIPTION_TYPE,
    currency:CURRENCY,
    iconLink:string
}


export interface ICalculateDuration {
    initial:number,
    currentTotal:number,
    startDate:Date,
    endDate:Date
}

