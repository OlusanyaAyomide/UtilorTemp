import { CURRENCY, DESCRIPTION_TYPE, PAYMENT_METHOD, TRANSACTION_STATUS, TRANSACTION_TYPE } from "@prisma/client";

export interface TransactionData {
    userId: string;
		amount: number;
    transactionReference: string;
    transactionCurrency: CURRENCY;
    description: DESCRIPTION_TYPE;
    paymentMethod: PAYMENT_METHOD;
    transactionType: TRANSACTION_TYPE;
}

export interface UWalletTransactionData {
    uWalletAccountId: string;
    transactionReference: string;
    amount: number;
    transactionType: TRANSACTION_TYPE;
    transactionCurrency: CURRENCY;
}

export interface USaveForUTransactionData {
  amount: number;
  transactionType: TRANSACTION_TYPE;
  uSaveForUAccountId: string;
  transactionReference: string;
  transactionStatus?: TRANSACTION_STATUS;
  transactionCurrency: CURRENCY;
}
