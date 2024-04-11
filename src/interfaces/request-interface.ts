export interface ILogInForm{
    email:string
    password:string   
}

export interface ISignUpForm extends ILogInForm{
    firstName:string
    lastName:string
    password:string
    isAgreed:boolean
    phoneNumber:string
}


export interface IOtpVerication{
    otpCode:string
    verifyToken:string
}