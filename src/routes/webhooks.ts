import express from "express"
import { verifyHook } from "../controllers/hooks/verifyHook"
import { createNewSaving } from "../controllers/hooks/hookController"



const hookRoutes = express.Router()


hookRoutes.route("/").post(verifyHook,async (req,res,next)=>{
    const eventType = req.body.event?.type
    console.log(eventType)
    switch (eventType){
        case 'CARD_TRANSACTION':
            createNewSaving(req,res,next)
            break
        default:
            console.log("new evevt",eventType)
            createNewSaving(req,res,next)
    }
})


export default hookRoutes