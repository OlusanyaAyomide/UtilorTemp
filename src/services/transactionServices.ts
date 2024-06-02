import { Transaction } from "@prisma/client";
import { getCurrentDollarRate } from "../utils/util";

export function getInitialDates(duration: number) {
  const dates: {date: string, interest: 0}[] = [];
  const currentDate = new Date();

  for (let i = duration - 1; i >= 0; i--) {
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - i);
    pastDate.setHours(2, 0, 0, 0); // Set time to 2:00 AM

    const formattedDate = pastDate.toISOString();

    dates.push({date: formattedDate, interest: 0});
  }

  return dates;
}

export default function calculateInterests({transactions, duration}:{transactions:Transaction[],duration:number}) {
    const result:{date:string,interest:number}[] = getInitialDates(duration);
    transactions.forEach((item)=>{
      const createdDate = new Date(item.createdAt);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >=0 && diffDays <= duration) {
        const interestInNaira = item.transactionCurrency === "USD"? item.amount * getCurrentDollarRate():item.amount
        const previousInterest = result[duration - diffDays].interest
        result[duration - diffDays] = {...result[duration - diffDays],interest:previousInterest + interestInNaira};
      }
    })

  return result
}