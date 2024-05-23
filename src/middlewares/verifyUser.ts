import { Request,Response,NextFunction } from 'express';
import ResponseHandler from '../utils/response-handler';
import { generateDeviceId } from '../utils/clientDevice';
import prismaClient from '../prisma/pris-client';
import jwt from "jsonwebtoken";
import { IExpressRequest, IUserDetail } from '../interfaces/user-interface';
import { getTimeFromNow } from '../utils/util';


export async function verifyUsers  (req:IExpressRequest,res:Response,next:NextFunction):Promise<Response | void>{
    const refreshToken = req.header('refreshToken') 
    const accessToken = req.header('accessToken') 
    if(accessToken){   
        try{
            const decoded = jwt.verify(accessToken,process.env.JWT_SECRET as string) as IUserDetail
            if(decoded.userId){
                req.user = decoded

                return next()
            }else{
                return ResponseHandler.sendErrorResponse({res,error:"Token malformed",code:401,status_code:"LOGIN_REDIRECT"})

            }
            
        }catch(err){
            return ResponseHandler.sendErrorResponse({res,error:"Token malformed",code:401,status_code:"LOGIN_REDIRECT"})
        }
    }
    
    if(!refreshToken){
        return ResponseHandler.sendErrorResponse({res,error:"Session Expired ,relog In",code:401,status_code:"LOGIN_REDIRECT"})
    }
    const deviceId = generateDeviceId(req)
    const isTokenValid = await prismaClient.session.findFirst({
        where:{
            deviceId,
            token:refreshToken,
            expiredAt:{
                gt:new Date()
            }
        },
        include:{
            user:true
        }
    })
    
    if(!isTokenValid){
        return ResponseHandler.sendErrorResponse({res,error:"Token Expired 2",code:401,status_code:"LOGIN_REDIRECT"})
    }

    const user =isTokenValid.user


    //tempoarily set to 1h for testing
    //create new access token
    const newAccessToken = jwt.sign(
        { userId:user.id,email:user?.email,isCredentialsSet:user.isCredentialsSet,isGoogleUser:user.isGoogleUser,isMailVerified:user.isMailVerified,firstName:user.firstName,lastName:user.lastName},
        process.env.JWT_SECRET as string,
        { expiresIn:"62m" }
    );


    //rotate refresh token to keep user coninously signed in
    const newRefreshToken = jwt.sign(
        {userId:user.id},
        process.env.JWT_SECRET as string,
        {expiresIn:"2h"}
    )

    await prismaClient.session.update({
        where:{id:isTokenValid.id},
        data:{
            token:newRefreshToken,
            expiredAt:getTimeFromNow(60)
        }
    })


    req.user={
        userId:user.id,
        firstName:user?.firstName || "",lastName:user?.lastName || "",
        isCredentialsSet:true,
        isGoogleUser:user.isGoogleUser,
        email:user.email,
        isMailVerified:user.isMailVerified
    }
    return next()
}