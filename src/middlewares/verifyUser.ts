import { Request,Response,NextFunction } from 'express';
import ResponseHandler from '../utils/response-handler';
import { generateDeviceId } from '../utils/clientDevice';
import prismaClient from '../prisma/pris-client';
import jwt from "jsonwebtoken";
import { IExpressRequest, IUserDetail } from '../interfaces/user-interface';


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
        },
        include:{
            user:true
        }
    })
    console.log(isTokenValid)
    
    if(!isTokenValid){
        return ResponseHandler.sendErrorResponse({res,error:"Token Expired 2",code:401})
    }

    // const currentDate = new Date()
    // const expiredDate = new Date(isTokenValid.expiredAt)
    // const isExpired = expiredDate > currentDate
    // console.log(expiredDate.toLocaleDateString())
    // console.log(currentDate.toLocaleDateString())
    // console.log(isExpired)
    // if(isExpired){
    //     await prismaClient.session.delete({
    //         where:{id:isTokenValid.id}
    //     })
    //     res.clearCookie("refreshToken")
    //     return ResponseHandler.sendErrorResponse({res,error:"Session Expired exp",code:401})
    // }

    const user =isTokenValid.user

    const newAcessToken = jwt.sign(
        { userId:user?.id,email:user?.email,isCredentialsSet:user.isCredentialsSet,isGoogleUser:user.isGoogleUser,isMailVerified:user.isMailVerified},
        process.env.JWT_SECRET as string,
        { expiresIn:"4m" }
    );

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