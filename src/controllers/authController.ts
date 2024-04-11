import ResponseHandler from "../utils/response-handler";
import prismaClient from "../prisma/pris-client";
import catchDefaultAsync from "../utils/catch-async";
import { ILogInForm, IOtpVerication, ISignUpForm } from "../interfaces/request-interface";
import { bcryptHash, generateMerchantID, generateOTP,getTimeFromNow } from "../utils/util";
import { mailSender } from "../utils/send-mail";
import { getUserCredentials } from "../request/googleRequest";
import { bcryptCompare } from "../utils/util";
import { setAuthCredentials } from "../utils/credentials-setup";
import { generateDeviceId } from "../utils/clientDevice";


export const createNewUser = catchDefaultAsync(async (req,res,next)=>{
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

    //add device to list of user Devices
    const deviceId = generateDeviceId(req)

    await prismaClient.userDevices.create({
        data:{
            userId:newUser.id,
            device:deviceId
        }
    })
    
    await mailSender({to:email,subject:"Utilor Sign up code",body:otpCode,name:`${firstName} ${lastName}`})
    //set otpId to user response cookie 
    res.cookie("verifyToken",newOtpObject.id,{
        maxAge:30*60*1000,
        secure:true,
        httpOnly:true,
        // signed:true,
    })

    return ResponseHandler.sendSuccessResponse({res,message:"SignUp code sent"})
})

//verify user OTP then sign user In
export const otpVerificationSign = catchDefaultAsync(async(req,res,next)=>{
    const {otpCode}:IOtpVerication = req.body
    
    const verifyToken = req.cookies["verifyToken"]
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
    await prismaClient.mailVerificationOTp.deleteMany({
        where:{
            id:otpVerification.id
        }
    })
    //delete otpId from req cookie 
    res.clearCookie("verifyToken")
    
    //create jwt to Sign In user
    const isAuthorized = await setAuthCredentials({req,res,id:updatedUser.id,email:updatedUser.email})
    if(!isAuthorized){
        return ResponseHandler.sendErrorResponse({res,error:"verify device",code:403})
    }
    return ResponseHandler.sendSuccessResponse({res,data:{
        user:updatedUser
    }})

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
            isVerified:true,
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


//signIn user with email and password
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

        //if unverified send new optCode to user email
        if(!user.isVerified){
            const otpCode = generateOTP()
            const newOtpObject = await prismaClient.mailVerificationOTp.create({
                data:{
                    userId:user.id,
                    expiredTime:getTimeFromNow(Number(process.env.OTP_EXPIRY_MINUTE)),
                    otpCode
                }
            })

            await mailSender({to:email,subject:"Utilor Sign up code",body:otpCode,name:`${user.firstName} ${user.lastName}`})

            //set otpId to user response cookie 
            res.cookie("verifyToken",newOtpObject.id,{
                maxAge:30*60*1000,
                secure:true,
                httpOnly:true,
                // signed:true,
            })
            return ResponseHandler.sendErrorResponse({res,code:403,error:"Email unverified, Check email for OTP code"})
        }    

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


export const reverifyToken=catchDefaultAsync(async(req,res,next)=>{
    const verifyToken = req.cookies['verifyToken']
    
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


export const verifyAndAddNewDevice = catchDefaultAsync(async(req,res,next)=>{
    const {otpCode}:IOtpVerication = req.body
    const identityToken =  req.cookies['identityToken']

    //find otp with identityToken and otpCode
    const userObject = await prismaClient.newDeviceOTP.findFirst({
        where:{
            id:identityToken,
            otpCode
        },
        include:{
            user:true
        }
    })

    if(!userObject){
        return ResponseHandler.sendErrorResponse({res,error:"Token invalid "})
    }

    //check if otp has not expired
    const currentDate =  new Date()
    if(currentDate>userObject.expiredTime){
        return ResponseHandler.sendErrorResponse({res,error:"OTP supplied invalid"})
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
    await prismaClient.newDeviceOTP.deleteMany({
        where:{
            id:userObject.id
        }
    })

    res.clearCookie("identityToken")

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
        }}
    })
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
    const resetObject = await prismaClient.resetpasswordOTP.create({
        data:{
            userId:user.id,
            otpCode,
            expiredTime:getTimeFromNow(Number(process.env.OTP_EXPIRY_MINUTE))
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
    const resetObject = await prismaClient.resetpasswordOTP.findFirst({
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