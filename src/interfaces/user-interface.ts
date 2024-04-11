import { Request } from "express";

export interface IUserDetail{
    userId: string;
    email: string;
    isCredentialsSet: boolean;
    isGoogleUser: boolean;
    firstName:string
    lastName:string
    isMailVerified:boolean
}
export interface IExpressRequest extends Request {
    user?:IUserDetail

}

