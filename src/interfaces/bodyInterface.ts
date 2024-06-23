import { CURRENCY, DESCRIPTION_TYPE, DividendDuration, InvestmentType, PAYMENT_METHOD } from "@prisma/client"
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
    pin:string
}

//deposit data can re used but has been copied for convenience
export interface IDepositUAndI {
    id: string;
    amount: number
    paymentMethod: 'UWALLET' | 'BANK' | 'CARD';
    pin:string
}

export interface IDepositToMyCabal {
    id: string;
    amount: number
    paymentMethod: 'UWALLET' | 'BANK' | 'CARD';
    pin:string
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


export interface ICreatePromoCode{
    percentage:number,
    name:string
    revokedAt : string
    expiredAt : string
    product : DESCRIPTION_TYPE
}

export interface IPromoCodeToSaving{
    promoCode : string
    savingsId : string
}


export interface IUpdateBvn{
    bvnNumber : string
    dateOfBirth : string
}

export interface ICreateNewUVestFund{
    companyName:string
    currency:CURRENCY
    unitPrice:number
    historicPerformance:{year:string,performance:number}[]
    annualReturns:number
    companyLogo:string
    about :string
    howYouEarn :string
    termsOfUse :string
    investmentType:InvestmentType
    dividendDuration:DividendDuration
    nextDividendDate:string
}


export interface IStartUVestInvestment{
    mutualId :string
    numberOfUnits:number
    pin:string
    paymentMethod:PAYMENT_METHOD

}