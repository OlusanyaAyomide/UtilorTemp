import { TRANSACTION_STATUS } from "@prisma/client";
import { TransactionData, USaveForUTransactionData, UWalletTransactionData } from "../interfaces/transactions.interface";
import prismaClient from "../prisma/pris-client";

export async function saveUwalletTransaction(transactionData: UWalletTransactionData) {
	const newUWalletTransaction = await prismaClient.uWalletTransaction.create({
		data: {
			uWalletAccountId: transactionData.uWalletAccountId,
			amount: transactionData.amount,
			transactionReference: transactionData.transactionReference,
			transactionType: transactionData.transactionType,
			transactionCurrency: transactionData.transactionCurrency
		}
	})

	return newUWalletTransaction;
}

export async function saveTransaction(transactionData: TransactionData) {
	const newTransaction = await prismaClient.transaction.create({
		data: {
			userId: transactionData.userId,
			transactionReference: transactionData.transactionReference,
			amount: transactionData.amount,
			transactionCurrency: transactionData.transactionCurrency,
			transactionType: transactionData.transactionType,
			description: transactionData.description,
			paymentMethod: transactionData.paymentMethod
		}
	});

	return newTransaction;
}

export async function saveForUTransaction(transactionData: USaveForUTransactionData) {
	const newTransaction = await prismaClient.usaveForUTransaction.create({
		data: {
			transactionReference: transactionData.transactionReference,
			transactionCurrency: transactionData.transactionCurrency,
			amount: transactionData.amount,
			uSaveForUAccountId: transactionData.uSaveForUAccountId,
			transactionType: transactionData.transactionType
		}
	});

	return newTransaction;
}

export async function updateGenericTransactionStatus(id: string, status: TRANSACTION_STATUS) {
	const updatedTransaction = await prismaClient.transaction.update({
		where: {id},
		data: {transactionStatus: status}
	});

	return updatedTransaction;
}


export async function updateUWalletTransactionStats(id: string, status: TRANSACTION_STATUS) {
	const updatedTransaction = await prismaClient.uWalletTransaction.update({
		where: {id},
		data: {transactionStatus: status}
	});

	return updatedTransaction;
}


export async function updateForUTransactionStatus(id: string, status: TRANSACTION_STATUS) {
	const updatedTransaction = await prismaClient.usaveForUTransaction.update({
		where: {id},
		data: {transactionStatus: status}
	});

	return updatedTransaction;
}