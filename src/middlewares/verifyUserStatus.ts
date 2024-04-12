import { IExpressRequest } from "../interfaces/user-interface";
import { Response,NextFunction } from 'express';
import prismaClient from "../prisma/pris-client";
import { generateOTP ,getTimeFromNow} from "../utils/util";
import { mailSender } from "../utils/send-mail";
import ResponseHandler from "../utils/response-handler";
import { generateDeviceId } from "../utils/clientDevice";

export async function verifyUserStats  (req:IExpressRequest,res:Response,next:NextFunction):Promise<Response | void>{
    //check is user email is verified
    if(!req.user){
        return ResponseHandler.sendErrorResponse({res,error:"verify users first before this middleware"})
    }
    const user = req.user

    if(!user?.isMailVerified){
        const otpCode = generateOTP()
        const newOtpObject = await prismaClient.verificationOTp.create({
            data:{
                userId:user?.userId || "",
                expiredTime:getTimeFromNow(Number(process.env.OTP_EXPIRY_MINUTE)),
                otpCode,
                type:"MAILVERIFICATION"
            }
        })

        await mailSender({to:user?.email || "",subject:"Utilor Sign up code",body:otpCode,name:`Utilor Verifcation`})

        //set otpId to user response cookie 
        res.cookie("MAILVERIFICATION",newOtpObject.id,{
            maxAge:30*60*1000,
            secure:true,
            httpOnly:true,
            // signed:true,
        })
        return ResponseHandler.sendErrorResponse({res,code:401,error:"Email unverified, Check email for OTP code"})
    } 

    
    const deviceId = generateDeviceId(req)

    const isDeviceActive = await prismaClient.userDevices.findFirst({
        where:{
            device:deviceId,
            userId:user?.userId
        }
    })

    //check if user device is recognised

    console.log(isDeviceActive,"device active")
    if(!isDeviceActive){
        //if not recognized send user a device verification Token
        const otpCode = generateOTP()
        
        const newDeviceOtp = await prismaClient.verificationOTp.create({
            data:{
                otpCode,
                expiredTime:getTimeFromNow(Number(process.env.OTP_EXPIRY_MINUTE)),
                userId:user?.userId || "",
                type:"DEVICEVERIFCATION"
            }
        })

        await mailSender({to: user?.email|| "",subject:"Utilor Sign In Identification",body:otpCode,name:"Confirm Identiy"})

        res.cookie("identityToken",newDeviceOtp.id,{
            maxAge:30*60*1000,
            secure:true,
            httpOnly:true,
            // signed:true,
        })
        return ResponseHandler.sendErrorResponse({res,error:"Verify device",code:403})
    }

    return next()
}