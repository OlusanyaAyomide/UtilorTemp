import ResponseHandler from "../../utils/response-handler";
import prismaClient from "../../prisma/pris-client";
import catchDefaultAsync from "../../utils/catch-async";
import { ILogInForm, IOtpVerication, ISignUpForm } from "../../interfaces/request-interface";
import { bcryptHash, generateMerchantID, generateOTP,getTimeFromNow } from "../../utils/util";
import { mailSender } from "../../utils/send-mail";
import { getUserCredentials } from "../../request/googleRequest";
import { bcryptCompare } from "../../utils/util";
import { setAuthCredentials } from "../../utils/credentials-setup";
import { generateDeviceId } from "../../utils/clientDevice";



export const createNewUser = catchDefaultAsync(async(req,res,next)=>{
    const {email}:{email:string} = req.body
    //check if email aleready exists
    const existingUser = await prismaClient.user.findFirst({
        where:{email}
    })
    //if user exists and mail is verified , send an error message
    if(existingUser && existingUser.isMailVerified){
        return ResponseHandler.sendErrorResponse({res,error:"Email Already Existing"})
    }
    

    //if user does not exists create a new user , a previous user whose mail is passed but is not verified would be able to get an email verification
    let newUserId = ""
    if(!existingUser){
        const merchantID = `#${generateMerchantID()}`
        const newUser = await prismaClient.user.create({
            data:{email,isGoogleUser:false,merchantID}
        })
        newUserId = newUser.id
    }
  

    const otpCode = generateOTP()
    await mailSender({to:email,subject:"Utilor Sign up code",body:otpCode,name:`Utilor Verifcation`})
    const otpObject = await prismaClient.verificationOTp.create({
        data:{
            otpCode,
            userId:existingUser?.id || newUserId,
            type:"MAILVERIFICATION",
            expiredTime:getTimeFromNow(Number(process.env.OTP_EXPIRY_MINUTE))
        }
    })

    res.cookie("MAILVERIFICATION",otpObject.id,{
        maxAge:30*60*1000,
        secure:true,
        httpOnly:true,
    })

    return ResponseHandler.sendSuccessResponse({res,message:"Verifcation sent to email"})

})


export const mailVerification = catchDefaultAsync(async(req,res,next)=>{
    const {otpCode}:IOtpVerication = req.body
    
    const verificationID = req.cookies["MAILVERIFICATION"]
    const otpVerification = await prismaClient.verificationOTp.findFirst({
        where:{
            id:verificationID,
            type:"MAILVERIFICATION",
            otpCode,
        },
        include:{
            user:true
        }
    })

    if(!otpVerification){
        return ResponseHandler.sendErrorResponse({res,error:"OTP Supplied Invalid"})
    }
 
    //check if otp has not expired
    const currentDate =  new Date()
    if(currentDate>otpVerification.expiredTime){
        return ResponseHandler.sendErrorResponse({res,error:"OTP supplied Expired"})
    }

    //update user mail verification status to true
    await prismaClient.user.update({
        where:{
            id:otpVerification.userId
        },
        data:{
            isMailVerified:true
        },
    })

    //delete verifcation token from cookie

    res.clearCookie("MAILVERIFICATION")

    //delete all OTp associated with user
    await prismaClient.verificationOTp.deleteMany({
        where:{
            userId:otpVerification.userId,type:"MAILVERIFICATION"
        }
    })
    
    return ResponseHandler.sendSuccessResponse({res,message:"Email succesfully verfied"})

})


export const completeBasicDetail = catchDefaultAsync(async (req,res,next)=>{
    const {firstName,lastName,password,email,phoneNumber}:ISignUpForm = req.body
    //check i
    const isExisting = await prismaClient.user.findFirst({
        where:{
            email:email
        }
    })

    if(!isExisting){
        return ResponseHandler.sendErrorResponse({res,error:"Email supplied invalid"})
    }


    const hashedPassword = await bcryptHash(password)
    //update created user information
    const user = await prismaClient.user.update({
        where:{email},
        data:{firstName,lastName,password:hashedPassword,phoneNumber,isCredentialsSet:true},
    })

    //add device to list of user Devices
    const deviceId = generateDeviceId(req)

    await prismaClient.userDevices.create({
        data:{
            userId:user.id,
            device:deviceId
        }
    })
    req.user={
        userId:user.id,
        firstName,lastName,
        isCredentialsSet:true,
        isGoogleUser:user.isGoogleUser,
        email,
        isMailVerified:user.isMailVerified
    }


    return next()

})


//signIn user with email and password
export const  userLogIn=catchDefaultAsync(async(req,res,next)=>{
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
        
        const isPasswordValid = await bcryptCompare({hashedPassword:user.password || "",password})
        if(!isPasswordValid){
            return ResponseHandler.sendErrorResponse({res,error:"Invalid Sign In details"})
        }

        req.user={
            userId:user.id,
            firstName:user.firstName || "",lastName:user.lastName || "",
            isCredentialsSet:user.isCredentialsSet,
            isGoogleUser:user.isGoogleUser,
            email,
            isMailVerified:user.isMailVerified
        }

        return next()
        
})


export const reverifyToken=catchDefaultAsync(async(req,res,next)=>{

    const verifyToken = req.cookies['MAILVERIFICATION']
    const token = await prismaClient.verificationOTp.findFirst({
        where:{
            id:verifyToken,type:"MAILVERIFICATION"
        },
        include:{
            user:true
        }
    })
    //if token in cookie is not retrieving any result, it must have been malformed , user should relogin
    if(!token){
        return ResponseHandler.sendErrorResponse({res,error:"Session Expired, RelogIn",code:401})
    }
    //delete all associated token the user has
    await prismaClient.verificationOTp.deleteMany({
        where:{
            userId:token.user.id,type:"MAILVERIFICATION"
        }
    })

    const otpCode = generateOTP()
    const otpObject = await prismaClient.verificationOTp.create({
        data:{
            otpCode,
            userId:token.user.id,
            expiredTime:getTimeFromNow(Number(process.env.OTP_EXPIRY_MINUTE)),
            type:"MAILVERIFICATION"
        }
    })

    await mailSender({to:token.user.email,subject:"Utilor SignInOTp",body:otpObject.otpCode,name:`${token.user.firstName} ${token.user.lastName}`})

    //set id to cookie
    res.cookie("MAILVERIFICATION",otpObject.id,{
        maxAge:30*60*1000,
        secure:true,
        httpOnly:true,
    })
    
    return ResponseHandler.sendSuccessResponse({res,data:{verifyToken:otpObject.id}})
  
})

export const verifyAndAddNewDevice = catchDefaultAsync(async(req,res,next)=>{
    const {otpCode}:IOtpVerication = req.body
    const identityToken =  req.cookies['identityToken']
    //find otp with identityToken and otpCode
    const userObject = await prismaClient.verificationOTp.findFirst({
        where:{
            id:identityToken,
            otpCode,
            type:"DEVICEVERIFCATION"
        },
        include:{
            user:true
        }
    })

    if(!userObject){
        return ResponseHandler.sendErrorResponse({res,error:"OTP Supplied Invalid"})
    }

    //check if otp has not expired
    const currentDate =  new Date()
    if(currentDate>userObject.expiredTime){
        return ResponseHandler.sendErrorResponse({res,error:"OTP supplied expired"})
    }

    const deviceId = generateDeviceId(req)
    const {user} = userObject

    await prismaClient.userDevices.create({
        data:{
            userId:user.id,
            device:deviceId
        }
    })
    
    //delete all device OTp associated with user
    await prismaClient.verificationOTp.deleteMany({
        where:{
            id:userObject.id,type:"DEVICEVERIFCATION"
        }
    })


    res.clearCookie("identityToken")
    req.user={
        userId:user.id,
        firstName:user.firstName || "",lastName:user.lastName || "",
        isCredentialsSet:true,
        isGoogleUser:user.isGoogleUser,
        email:user.email,
        isMailVerified:user.isMailVerified
    }
    return next()
})


export const forgotPassword = catchDefaultAsync(async(req,res,next)=>{
    const {email} = req.body

    const user = await prismaClient.user.findFirst({
        where:{email}
    })
    if(!user){
        return ResponseHandler.sendErrorResponse({res,error:"Email is not recognized"})
    }

    if(user.isGoogleUser){
        return ResponseHandler.sendErrorResponse({res,error:"Google users can not reset password"})   
    }

    const otpCode = generateOTP()
    const resetObject = await prismaClient.verificationOTp.create({
        data:{
            userId:user.id,
            otpCode,
            expiredTime:getTimeFromNow(Number(process.env.OTP_EXPIRY_MINUTE)),
            type:"RESETPASSWORD"
        }
    })

    await mailSender({to:email,subject:"Verify Email Adress",body:otpCode,name:`${user.firstName} ${user.lastName}`})
    
    //set resetObjectId in response cookies
    res.cookie("resetToken",resetObject.id,{
        maxAge:30*60*1000,
        secure:true,
        httpOnly:true,
        // signed:true,
    })

    return ResponseHandler.sendSuccessResponse({res,message:"Verification mail sent"})
    
})

export const resetPassword = catchDefaultAsync(async(req,res,next)=>{
    const verificationToken = req.cookies['resetToken']
    const {otpCode,password}:{otpCode:string,password:string} = req.body

    //validate if otp code is valid
    const resetObject = await prismaClient.verificationOTp.findFirst({
        where:{
            id:verificationToken,
            otpCode
        },
        include:{
            user:true
        }
    })

    if(!resetObject){
        return ResponseHandler.sendErrorResponse({res,error:"OTP supplied invalid"})
    }

    //prevent reset password of google users
    if(resetObject.user.isGoogleUser){
        return ResponseHandler.sendErrorResponse({res,error:"Google users can not reset password"})
    }

    const hashedPassword = await bcryptHash(password)
    const user = await prismaClient.user.update({
        where:{id:resetObject.user.id},
        data:{
            password:hashedPassword
        }
    })
    await prismaClient.verificationOTp.deleteMany({
        where:{
            userId:resetObject.userId,
            type:"RESETPASSWORD"
        }
    })

    res.clearCookie("resetToken")

    return ResponseHandler.sendSuccessResponse({res,data:{
        user:{
            id:user.id,
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
            isVerified:true
        }
    }
    })
})


export const googleSignUp = catchDefaultAsync(async(req,res,next)=>{
    const {googleToken}:{googleToken:string} = req.body

    //get user information from goolge with the token provided

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
            isMailVerified:true,
            password:hashedPassword,
            merchantID
        }
    })
    //create a new device ID tied to the user
    const deviceId = generateDeviceId(req)

    await prismaClient.userDevices.create({
        data:{
            userId:newUser.id,
            device:deviceId
        }
    })
    //set user response cookies
    const isAuthorized = await setAuthCredentials({req,res,id:newUser.id,email:newUser.email})
    if(!isAuthorized){
        return ResponseHandler.sendErrorResponse({res,error:"verify device",code:403})
    }

    return ResponseHandler.sendSuccessResponse({res,data:{
        user:{
            id:newUser.id,
            email:newUser.email,
            firstName:newUser.firstName,
            lastName:newUser.lastName,
            isVerified:true
        }
    }})

})


//signIn with google

export const googleSignIn = catchDefaultAsync(async(req,res,next)=>{

    const {googleToken}:{googleToken:string} = req.body

    //get user information from goolge with the token provided

    const userData = await getUserCredentials({googleToken})

    console.log(userData)
    if(!userData){
        return ResponseHandler.sendErrorResponse({res,error:"Google Token Invalid"})
    }

    const user = await prismaClient.user.findUnique({
        where:{
            email:userData.email
        }
    })

    if(!user){
        return ResponseHandler.sendErrorResponse({res,error:"Email does not exist "})   
    }

    if(!user.isGoogleUser){
        return ResponseHandler.sendErrorResponse({res,error:"Sign In with email and pasword"})
    }
    //set user response cookies
    const isAuthorized = await setAuthCredentials({req,res,id:user.id,email:user.email})

    if(!isAuthorized){
        return ResponseHandler.sendErrorResponse({res,error:"verify device",code:403})
    }

    return ResponseHandler.sendSuccessResponse({res,data:{
        user:{
            id:user.id,
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
            isVerified:true
        }
    }})
    

})