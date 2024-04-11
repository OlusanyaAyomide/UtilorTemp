import { Request,Response,NextFunction } from 'express';
import ResponseHandler from '../utils/response-handler';
import { generateDeviceId } from '../utils/clientDevice';
import prismaClient from '../prisma/pris-client';

export async function signUpValidation (req:Request,res:Response,next:NextFunction):Promise<Response | void>{
    const refreshToken = req.cookies['refreshToken']
    const accesToken = req.cookies['acessToken']

    if(accesToken){
        
    }

    
    if(!refreshToken){
        return ResponseHandler.sendErrorResponse({res,error:"Session Expired",code:401,})
    }
    const deviceId = generateDeviceId(req)
    const isTokenValid = await prismaClient.session.findFirst({
        where:{
            deviceId,
            token:refreshToken
        },
        include:{
            user:true
        }
    })
    if(!isTokenValid){
        return ResponseHandler.sendErrorResponse({res,error:"Token Expired",code:401})
    }
}