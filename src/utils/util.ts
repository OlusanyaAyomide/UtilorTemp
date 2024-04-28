import bcrypt from "bcrypt";
import base64 from "base-64";

export function generateOTP(): string {
  const otpLength = 4;
  let otp = '';
  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}




export function generateMerchantID(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';

  while (id.length < 11) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const char = characters.charAt(randomIndex);

    if (!id.includes(char)) {
      id += char;
    }
  }

  return id
}

export function getTimeFromNow(futureTime:number){
    const timeFromNow = new Date()
    const dateTimeIn30Minutes = new Date(timeFromNow.getTime() + futureTime * 60000)
    return dateTimeIn30Minutes
}


export async function bcryptHash(password:string){

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password,salt)
    return hashed
}


export async function  bcryptCompare({password,hashedPassword}:{password:string,hashedPassword:string}){
    const isValid =  await bcrypt.compare(password,hashedPassword)
    return isValid
}

export  function convertToDate(dateString:string){
    const date = new Date(dateString)
    return date
}
//this would be prefixed to the transaction ref, it would be used later from the webhook for find the resulting type of model to query

export function generateTransactionRef(length?:number){
    const stringLength = length || 14
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijlmnopqrstuvwxyz';
    while (id.length < stringLength) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const char = characters.charAt(randomIndex);
    
      if (!id.includes(char)) {
        id += char;
      }
    }
  
    return id

}

export function getCurrentDollarRate() {
  // Todo: Implement receiving current rate from the db
  return 1200.00;
}


// Todo: Implement an enumToRegex function to help with JOI Validation
// export function enumToRegex(enum: Enum) {

// }


export const generateConsentToken = ()=>{

}