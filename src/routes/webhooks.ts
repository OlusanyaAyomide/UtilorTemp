import express from "express"
import { verifyHook } from "../controllers/hooks/verifyHook"
import { WebhookData } from "../interfaces/webhook.interface"



const hookRoutes = express.Router()


hookRoutes.route("/").post(verifyHook)


export default hookRoutes