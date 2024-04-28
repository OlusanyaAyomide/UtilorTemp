import express from "express"
import { verifyUserStats } from "../middlewares/verifyUserStatus"
import { verifyUsers } from "../middlewares/verifyUser"
import { createConsentValidation } from "../validations/userValidation"
import { createConsentToken, retrieveConsentToken } from "../controllers/user/userController"
import { getWalletInfo } from "../controllers/wallet/walletController"



const walletRoutes = express.Router()

// ForU routes
walletRoutes.route("/info").get(verifyUsers,verifyUserStats,getWalletInfo)



export default walletRoutes