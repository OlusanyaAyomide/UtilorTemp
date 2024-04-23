import { Prisma, TRANSACTION_STATUS, Transaction } from "@prisma/client";
import prismaClient from "../prisma/pris-client";

export async function updateTransactionStatus(id: string, status: TRANSACTION_STATUS) {
	const updatedTransaction = await prismaClient.transaction.update({
		where: {id},
		data: {transactionStatus: status}
	});

	return updatedTransaction;
}