import { Response } from "express";

interface ISetCookie{
    res:Response
    value:string
    name:string
    duration?:number
}
export const setCookie=({name,value,duration=3600,res}:ISetCookie)=>{
    const currentTime = new Date()
    const futureTime = new Date(currentTime.getTime() + (duration * 60000))
    const isProd = process.env.APP_ENV !== "DEV"
    res.cookie(name,value,{
        maxAge:duration*60*1000,
        secure:isProd,
        httpOnly:true,
        sameSite:isProd ? "none":"lax",
        // expires:futureTime,
        partitioned:isProd,
    })
}