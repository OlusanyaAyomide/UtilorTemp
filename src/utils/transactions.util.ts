import { CURRENCY, Prisma, TRANSACTION_STATUS, Transaction } from "@prisma/client";
import prismaClient from "../prisma/pris-client";
import { getCurrentDollarRate } from "./util";

export async function updateTransactionStatus(id: string, status: TRANSACTION_STATUS) {
	const updatedTransaction = await prismaClient.transaction.update({
		where: {id},
		data: {transactionStatus: status}
	});

	return updatedTransaction;
}


interface IConvertRate{
	amount:number
	from : CURRENCY,
	to :CURRENCY
}
export const getConvertedRate =({amount,from,to}:IConvertRate)=>{
	const rate = getCurrentDollarRate()
	if((from === "NGN") && (to === "USD")){
		return amount/rate
	}else if((from === "USD") && (to === "NGN")){
		return amount * rate
	}
	else{
		return amount
	}
}