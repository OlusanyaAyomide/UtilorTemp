import { Response,NextFunction,Request } from "express";
import { IExpressRequest } from "../interfaces/user-interface";
import ResponseHandler from "../utils/response-handler";
import prismaClient from "../prisma/pris-client";
import catchDefaultAsync from "../utils/catch-async";
import { ILogInForm, IOtpVerication, ISignUpForm } from "../interfaces/request-interface";
import { bcryptHash, generateMerchantID, generateOTP,getTimeFromNow } from "../utils/util";
import { mailSender } from "../utils/send-mail";
import jwt from "jsonwebtoken";
import { getUserCredentials } from "../request/googleRequest";
import { bcryptCompare } from "../utils/util";


export const createNewUser = catchDefaultAsync(async (req,res,next)=>{
    console.log("in here")
    const {email,firstName,lastName,password}:ISignUpForm = req.body
    //check if email exist
    const isExisting = await prismaClient.user.findUnique({
        where:{
            email:email
        }
    })
    //check if email exists
    console.log(isExisting)
    if(isExisting){
        return ResponseHandler.sendErrorResponse({res,error:"Email already in Use"})
    }

    //create a new utilor user
    const merchantID = `#${generateMerchantID()}`
    const hashedPassword = await bcryptHash(password)
     const newUser = await prismaClient.user.create({
        data:{
            email,firstName,lastName,
            isVerified:false,isGoogleUser:false,merchantID,password:hashedPassword
        }      
    })

    //create new OTp
    const otpCode = generateOTP()
    const newOtpObject = await prismaClient.mailVerificationOTp.create({
        data:{
            userId:newUser.id,
            expiredTime:getTimeFromNow(Number(process.env.OTP_EXPIRY_MINUTE)),
            otpCode
        }
    })
    
    await mailSender({to:email,subject:"Utilor Sign up Otp",body:otpCode,name:`${firstName} ${lastName}`})

    return ResponseHandler.sendSuccessResponse({res,data:{verifyToken:newOtpObject.id}})
})


export const otpVerificationSign = catchDefaultAsync(async(req,res,next)=>{
    const {verifyToken,otpCode}:IOtpVerication = req.body
    const otpVerification = await prismaClient.mailVerificationOTp.findFirst({
        where:{
            AND:[
                {id:verifyToken},
                {otpCode}
            ]
        },
        include:{
            user:true
        }
    })
    console.log(otpVerification?.user)
    if(!otpVerification){
        return ResponseHandler.sendErrorResponse({res,error:"OTP supplied invalid"})   
    }
    //check if otp has not expired
    const currentDate =  new Date()
    if(currentDate>otpVerification.expiredTime){
        return ResponseHandler.sendErrorResponse({res,error:"OTP supplied invalid"})
    }

    const updatedUser = await prismaClient.user.update({
        where:{
            id:otpVerification.user.id
        },
        data:{
            isVerified:true
        },
        select:{
            id:true,
            email:true,
            firstName:true,
            lastName:true,
            isVerified:true
        }
    })
     //delete all OTp associated with user
    await prismaClient.mailVerificationOTp.delete({
        where:{
            id:otpVerification.id
        }
    }) 

    //create jwt to Sign In user
    const token = jwt.sign(
        { id:updatedUser.id, email: updatedUser.email },
        process.env.JWT_SECRET as string,
        { expiresIn:"1h" }
      );
    return ResponseHandler.sendSuccessResponse({res,data:{
        token,user:updatedUser
    }})

})



export const googleSignUp = catchDefaultAsync(async(req,res,next)=>{
    const {googleToken}:{googleToken:string} = req.body
    const userData = await getUserCredentials({googleToken})
    console.log(userData)
    if(!userData){
        return ResponseHandler.sendErrorResponse({res,error:"Google Token Invalid"})
    }
    const isExisting = await prismaClient.user.findUnique({
        where:{
            email:userData.email
        }
    })
    if(isExisting){
        return ResponseHandler.sendErrorResponse({res,error:"Email already in use"})
    }
    const hashedPassword = await bcryptHash(`${userData.id}${process.env.JWT_SECRET}`)
    const merchantID = `#${generateMerchantID()}`
    const newUser = await prismaClient.user.create({
        data:{
            email:userData.email,
            firstName:userData.given_name || "",
            lastName:userData.family_name || "",
            isGoogleUser:true,
            isVerified:true,
            password:hashedPassword,
            merchantID
        }
    })

    //create jwt to Sign In user
    const token = jwt.sign(
        { id:newUser.id, email: newUser.email },
        process.env.JWT_SECRET as string,
        { expiresIn:"1h" }
      );
    return ResponseHandler.sendSuccessResponse({res,data:{
        token,user:{
            id:newUser.id,
            email:newUser.email,
            firstName:newUser.firstName,
            lastName:newUser.lastName,
            isVerified:true
        }
    }})

})

export const credentialSignIn=catchDefaultAsync(async(req,res,next)=>{
        const {email,password}:ILogInForm = req.body
        const user = await prismaClient.user.findUnique({
            where:{email}
        })
        if(!user){
            return ResponseHandler.sendErrorResponse({res,error:"Invalid Sign In details"})
        }

        if(user.isGoogleUser){
            return ResponseHandler.sendErrorResponse({res,error:"Sign In with google account"})
        }
        const isPasswordValid = await bcryptCompare({hashedPassword:user.password,password})
        if(!isPasswordValid){
            return ResponseHandler.sendErrorResponse({res,error:"Invalid Sign In details"})
        }

        if(!user.isVerified){
            return ResponseHandler.sendErrorResponse({res,code:403,error:"Email unverified"})
        }    
        const token = jwt.sign(
        { id:user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn:"1h" }
        );

        return ResponseHandler.sendSuccessResponse({res,data:{
        token,user:{
            id:user.id,
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
            isVerified:true
        }
    }})
        
})


export const reverifyToken=catchDefaultAsync(async(req,res,next)=>{
    const {verifyToken}:{verifyToken:string} = req.body
    const token = await prismaClient.mailVerificationOTp.findUnique({
        where:{
            id:verifyToken
        },
        include:{
            user:true
        }
    })
    if(!token){
        return ResponseHandler.sendErrorResponse({res,error:"Token invalid "})
    }
    await prismaClient.mailVerificationOTp.deleteMany({
        where:{
            userId:token.user.id   
        }
    })
    const otpCode = generateOTP()
    const otp = await prismaClient.mailVerificationOTp.create({
        data:{
            otpCode,
            userId:token.user.id,
            expiredTime:getTimeFromNow(Number(process.env.OTP_EXPIRY_MINUTE)),
        }
    })
    await mailSender({to:token.user.email,subject:"Utilor SignInOTp",body:otp.otpCode,name:`${token.user.firstName} ${token.user.lastName}`})
    return ResponseHandler.sendSuccessResponse({res,data:{verifyToken:otp.id}})
    
})