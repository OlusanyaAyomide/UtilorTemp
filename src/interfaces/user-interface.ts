import { Request } from "express"

export interface IExpressRequest{
    id:string,
    email:string
    firstName:string
    lastName:string
    isVerified:boolean
    merchantID:string
}