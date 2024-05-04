import { CURRENCY } from "@prisma/client"
export interface ICreateForU {
    currency: 'NGN' | 'USD';
    savingsName: string;
    expectedDepositDay: number;
    expectedMonthlyAmount: number;
    endingDate:string;
    iconLink:string
}

export interface IDepositForU {
    id: string;
    amount: number
    paymentMethod: 'UWALLET' | 'BANK' | 'CARD';
}

//deposit data can re used but has been copied for convinience
export interface IDepositUAndI {
    id: string;
    amount: number
    paymentMethod: 'UWALLET' | 'BANK' | 'CARD';
}

export interface IDepositToMyCabal {
    id: string;
    amount: number
    paymentMethod: 'UWALLET' | 'BANK' | 'CARD';
}

export interface ICreateUandI extends ICreateForU{
    consentToken:string
}   


export interface ICreateCabal{
    lockedInDate:string
    groupName:string
    currency:CURRENCY
    iconLink : string
    description : string
}



export interface ISendCabalInvitation{
    merchantId : string
    cabalId : string
}

export interface IJoinCabal{
    cabalId :string
}