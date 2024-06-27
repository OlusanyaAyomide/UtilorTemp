import { DividendDuration } from "@prisma/client";

export function getDifferenceInDays(startDate: string | Date, endDate: string | Date): number {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
  
  
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = date2.getTime() - date1.getTime();
  
    // Convert the difference from milliseconds to days
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
  
    return Math.abs(differenceInDays);
  }
  

export function isGreaterThanDay(date:string | Date){
  const givenDate = new Date(date)
  const currentDate = new Date()

  const differenceInMilliseconds = givenDate.getTime() - currentDate.getTime();
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
  return differenceInDays < 0
} 
  

export function getMidnightISODateTomorrow(): string {
  const tomorrow = new Date();
  const tomorrowAtDate = new Date(tomorrow.setDate(tomorrow.getDate() + 1)); // Add one day
  return tomorrowAtDate.toISOString();
}


//Add x amount of days to the date passed
export function addDateFrequency({date, frequency}:{date:Date,frequency:DividendDuration}): Date {
  const result = new Date(date);
  
  switch (frequency) {
    case 'DAILY':
      result.setDate(result.getDate() + 1);
      break;
      
    case 'WEEKLY':
      result.setDate(result.getDate() + 7);
      break;
      
    case 'BIMONTHLY':
      const daysInMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
      const bimonthlyDays = Math.ceil(daysInMonth / 2);
      result.setDate(result.getDate() + bimonthlyDays);
      break;
      
    case 'MONTHLY':
      result.setMonth(result.getMonth() + 1);
      break;
      
    case 'QUARTERLY':
      result.setMonth(result.getMonth() + 3);
      break;
      
    case 'BIYEARLY':
      result.setMonth(result.getMonth() + 6);
      break;
      
    case 'ANNUALLY':
      result.setFullYear(result.getFullYear() + 1);
      break;
      
    default:
      result.setDate(result.getDate());
  }
  
  return result;
}


