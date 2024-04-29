import { Request,Response,NextFunction } from 'express';
import ResponseHandler from '../utils/response-handler';
import { generateDeviceId } from '../utils/clientDevice';
import prismaClient from '../prisma/pris-client';
import jwt from "jsonwebtoken";
import { IExpressRequest, IUserDetail } from '../interfaces/user-interface';
import { getTimeFromNow } from '../utils/util';


export async function verifyUsers  (req:IExpressRequest,res:Response,next:NextFunction):Promise<Response | void>{
    const refreshToken = req.cookies['refreshToken']
    const accessToken = req.cookies['acessToken']

    if(accessToken){   
        try{
            const decoded = jwt.verify(accessToken,process.env.JWT_SECRET as string) as IUserDetail
            if(decoded.userId){
                req.user = decoded

                return next()
            }else{
                return ResponseHandler.sendErrorResponse({res,error:"Token malformed",code:401})

            }
            
        }catch(err){
            return ResponseHandler.sendErrorResponse({res,error:"Token malformed",code:401})
        }

    }
    
    if(!refreshToken){
        return ResponseHandler.sendErrorResponse({res,error:"Session Expired 1",code:401})
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
    console.log(isTokenValid)
    
    if(!isTokenValid){
        return ResponseHandler.sendErrorResponse({res,error:"Token Expired 2",code:401})
    }


    const user =isTokenValid.user


    //create new access token
    const newAcessToken = jwt.sign(
        { userId:user.id,email:user?.email,isCredentialsSet:user.isCredentialsSet,isGoogleUser:user.isGoogleUser,isMailVerified:user.isMailVerified,firstName:user.firstName,lastName:user.lastName},
        process.env.JWT_SECRET as string,
        { expiresIn:"4m" }
    );


    //rotate refresh token to keep user coninously signed in
    const newRefreshToken = jwt.sign(
        {userId:user.id},
        process.env.JWT_SECRET as string,
        {expiresIn:"1h"}
    )

    await prismaClient.session.update({
        where:{id:isTokenValid.id},
        data:{
            token:newRefreshToken,
            expiredAt:getTimeFromNow(60)
        }
    })

    //set  refresh token to cookie
    res.cookie("refreshToken",newRefreshToken,{
        maxAge:60*60*1000,
        secure:true,
        httpOnly:true,
        // signed:true,
    })

    //set accesss token to cookie
    res.cookie("acessToken",newAcessToken,{
        maxAge:3*60*1000,
        secure:true,
        httpOnly:true,
        // signed:true,
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