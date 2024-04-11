import { Request } from "express";

export interface IExpressRequest extends Request {
    user?:{
        userId: string;
        email: string;
        isCredentialsSet: boolean;
        isGoogleUser: boolean;
        firstName:string
        lastName:string
        isMailVerified:boolean
    }

}

