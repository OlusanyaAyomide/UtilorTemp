export interface ILogInForm{
    email:string
    password:string   
}

export interface ISignUpForm extends ILogInForm{
    firstName:string
    lastName:string
    confirmPassword:string
    referralId?:string
    isAgreed:boolean
}


export interface IOtpVerication{
    otpCode:string
    verifyToken:string
}