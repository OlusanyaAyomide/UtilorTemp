import { Response } from "express";

interface ISetCookie{
    res:Response
    value:string
    name:string
    duration?:number
}
export const setCookie=({name,value,duration=30,res}:ISetCookie)=>{
    const currentTime = new Date()
    const futureTime = new Date(currentTime.getTime() + (30 * 60000))
    res.cookie(name,value,{
        // maxAge:duration*60*1000,
        secure:true,
        httpOnly:false,
        sameSite:"none",
        expires:futureTime,
    
    })
}