import jwt from "jsonwebtoken";
import { Response } from "express";
import prismaClient from "../prisma/pris-client";
import { Request } from "express";
import { generateDeviceId } from "./clientDevice";
import { generateOTP, getTimeFromNow } from "./util";
import { mailSender } from "./send-mail";
import { setCookie } from "./CookieService";

interface IsetAuthCookie{
    req:Request
    res:Response
    id:string
    email:string
}

export  async function setAuthCredentials ({req,res,id,email}:IsetAuthCookie){
    const acessToken = jwt.sign(
        { id,email },
        process.env.JWT_SECRET as string,
        { expiresIn:"2m" }
    );
    const refreshToken = jwt.sign(
        {userid:id},
        process.env.JWT_SECRET as string,
        {expiresIn:"1h"}
    )
    const deviceId = generateDeviceId(req)


    //check if user device is recognised

    const isDeviceActive = await prismaClient.userDevices.findFirst({
        where:{
            device:deviceId,
            userId:id
        }
    })
    console.log(isDeviceActive,"device active")
    if(!isDeviceActive){
        //if not recognized send user a device verification Token
        const otpCode = generateOTP()
        const newDeviceOtp = await prismaClient.verificationOTp.create({
            data:{
                otpCode,
                expiredTime:getTimeFromNow(Number(process.env.OTP_EXPIRY_MINUTE)),
                userId:id,
                type:"DEVICEVERIFCATION"
            }
        })

        await mailSender({to:email,subject:"Utilor Sign In Identification",body:otpCode,name:"Confirm Identiy"})

        // setCookie({res,name:'identityToken',value:newDeviceOtp.id})
        return  false
    }

    //check is session with devideID and token already exists
    const isSessionExisting = await prismaClient.session.findFirst({
        where:{
            deviceId,
            userId:id
        }
    }) 

    if(isSessionExisting){
        await prismaClient.session.update({
            where:{id:isSessionExisting.id},
            data:{
                token:refreshToken,
                expiredAt:getTimeFromNow(60)
            }
        })
    }
    else{   
        //create new session for user 
        await prismaClient.session.create({
            data:{
                userId:id,
                token:refreshToken,
                deviceId,
                expiredAt:getTimeFromNow(60)
            }
        })

    }
    // setCookie({res,name:"acessToken",value:acessToken,duration:5})
    // setCookie({res,name:"refreshToken",value:refreshToken,duration:60})
    return true

}   