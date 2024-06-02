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
  