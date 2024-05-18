export interface ILogInForm{
    email:string
    password:string   
}

export interface ISignUpForm{
    firstName:string
    lastName:string
    password:string
    isAgreed:boolean
    phoneNumber:string
    merchantID?:string
    email:string
    
}


export interface IOtpVerication{
    otpCode:string
    MAILVERIFICATION:string
}



export interface ICreateNewCabal{

}