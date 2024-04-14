export interface ICreateForU {
    currency: 'NGN' | 'USD';
    isActivated: boolean;
    savingsName: string;
    expectedDepositDay: number;
    expectedMonthlyAmount: number;
    endingDate:string;
    amount:number
}
