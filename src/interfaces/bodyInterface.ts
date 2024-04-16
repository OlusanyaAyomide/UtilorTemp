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
    paymentMethod: 'USTASH' | 'BANK' | 'CARD';
}