import express from "express"
import { verifyUserStats } from "../middlewares/verifyUserStatus"
import { verifyUsers } from "../middlewares/verifyUser"
import { createConsentValidation } from "../validations/userValidation"
import { createConsentToken, retrieveConsentToken } from "../controllers/user/userController"



const userRoutes = express.Router()

// ForU routes
userRoutes.route("/consent-token/create").post(verifyUsers,verifyUserStats,createConsentValidation,createConsentToken)
userRoutes.route("/consent-token/retrieve").get(verifyUsers,verifyUserStats,retrieveConsentToken)



export default userRoutes