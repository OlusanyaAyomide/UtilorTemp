import { CURRENCY } from "@prisma/client"
export interface ICreateForU {
    currency: 'NGN' | 'USD';
    savingsName: string;
    expectedDepositDay: number;
    expectedMonthlyAmount: number;
    endingDate:string;
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


export interface ICreateUandI extends ICreateForU{
    consentToken:string
}   