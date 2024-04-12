import ResponseHandler from "../../utils/response-handler";
import jwt from "jsonwebtoken";
import prismaClient from "../../prisma/pris-client";
import { generateDeviceId } from "../../utils/clientDevice";
import { mailSender } from "../../utils/send-mail";
import { bcryptHash, generateOTP } from "../../utils/util";
import { getTimeFromNow } from "../../utils/util";
import catchDefaultAsync from "../../utils/catch-async";

//in charge of asigning token and signing in users
export const credentialSignIn= catchDefaultAsync(async(req,res,next)=>{
    const user = req.user



    //send otp code to user if mail is not verified
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

    
    const acessToken = jwt.sign(
        { userId:user?.userId,email:user?.email,isCredentialsSet:user.isCredentialsSet,isGoogleUser:user.isGoogleUser,isMailVerified:user.isMailVerified},
        process.env.JWT_SECRET as string,
        { expiresIn:"4m" }
    );

    const refreshToken = jwt.sign(
        {userId:user?.userId},
        process.env.JWT_SECRET as string,
        {expiresIn:"62m"}
    )

    //check is session with devideID and token already exists
    const isSessionExisting = await prismaClient.session.findFirst({
        where:{
            deviceId,
            userId:user?.userId,
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
                userId:user?.userId || "",
                token:refreshToken,
                deviceId,
                expiredAt:getTimeFromNow(60)
            }
        })
    }

    res.cookie("acessToken",acessToken,{
        maxAge:3*60*1000,
        secure:true,
        httpOnly:true,
        // signed:true,
    })

    res.cookie("refreshToken",refreshToken,{
        maxAge:60*60*1000,
        secure:true,
        httpOnly:true,
        // signed:true,
    })



    return ResponseHandler.sendSuccessResponse({res,data:{
        user:{
            id:user?.userId ,
            email:user?.email,
            firstName:user?.firstName,
            lastName:user?.lastName,
            isMailVerified:user.isMailVerified,
        }
    }})

})

export const createPin = catchDefaultAsync(async (req,res,next)=>{
    
    // Check for user credentials
    const user = req.user;
    
    if (!user) {
        return ResponseHandler.sendErrorResponse({res, error: "Something went wrong. Please login once more", code: 403})
    }
    
    // Get user PIN
    const {pin}: {pin: string} = req.body;

    // Get user Device ID
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

    //Todo check if user device is mobile/tablet
    // if (isDeviceActive.device) {

    // }

    
    const acessToken = jwt.sign(
        { userId:user?.userId,email:user?.email,isCredentialsSet:user.isCredentialsSet,isGoogleUser:user.isGoogleUser,isMailVerified:user.isMailVerified},
        process.env.JWT_SECRET as string,
        { expiresIn:"4m" }
    );

    const refreshToken = jwt.sign(
        {userId:user?.userId},
        process.env.JWT_SECRET as string,
        {expiresIn:"62m"}
    )

    //check is session with deviceID and token already exists
    const isSessionExisting = await prismaClient.session.findFirst({
        where:{
            deviceId,
            userId:user?.userId,
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
                userId:user?.userId || "",
                token:refreshToken,
                deviceId,
                expiredAt:getTimeFromNow(60)
            }
        })
    }

    const hashedPin = await bcryptHash(pin);

    // Check if PIN already exists

    const pinAlreadyExists = await prismaClient.user.findFirst({
        where: {email: user.email},
        select: {pin: true}
    })

    if (pinAlreadyExists) {
        return ResponseHandler.sendErrorResponse({res, error: "PIN already set up", code: 409})
    }

    const savedUser = await prismaClient.user.update({
        where:{id: user.userId},
        data: {
            pin: hashedPin
        }
    })

    return ResponseHandler.sendSuccessResponse({res,data:{
        message: "PIN setup successfully"
    }});
})