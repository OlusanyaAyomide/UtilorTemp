import express from "express"

import { signUpValidation } from "../validations/authValidation"
import { SubscribeToNewsLetter, retrieveAllSubscribers, unSubscribeFromNewsLetter } from "../controllers/general/newsLetter"
import { verifyAdminStatus } from "../controllers/admin/verifyAdminStatus"




const generalRoutes = express.Router()

// ForU routes
generalRoutes.route("/newsletter/subscribe").post(signUpValidation,SubscribeToNewsLetter)
generalRoutes.route("/newsletter/unsubscribe").post(signUpValidation,unSubscribeFromNewsLetter)
generalRoutes.route("/newsletter/list").get(verifyAdminStatus,retrieveAllSubscribers)





export default generalRoutes