import express from "express"
import { verifyHook } from "../controllers/hooks/verifyHook"
import { channelWebHookData, depositIntoForUSaving } from "../controllers/hooks/hookController"
import { WebhookData } from "../interfaces/webhook.interface"



const hookRoutes = express.Router()


hookRoutes.route("/").post(verifyHook, channelWebHookData)


export default hookRoutes