import express from "express"
import { verifyUserStats } from "../middlewares/verifyUserStatus"
import { verifyUsers } from "../middlewares/verifyUser"
import { createConsentValidation } from "../validations/userValidation"
import { createConsentToken, getUserNotifications, retrieveConsentToken } from "../controllers/user/userController"



const userRoutes = express.Router()

// ForU routes
userRoutes.route("/consent-token/create").post(verifyUsers,verifyUserStats,createConsentValidation,createConsentToken)
userRoutes.route("/consent-token/retrieve").get(verifyUsers,verifyUserStats,retrieveConsentToken)
userRoutes.route("/notifications/all").get(verifyUsers,verifyUserStats,getUserNotifications)



export default userRoutes