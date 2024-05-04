import express from "express"
import { verifyUserStats } from "../middlewares/verifyUserStatus"
import { verifyUsers } from "../middlewares/verifyUser"
import { depositIntoUWallet, getWalletInfo } from "../controllers/wallet/walletController"
import { depositUWalletValidation } from "../validations/savingsValidation"



const walletRoutes = express.Router()

// ForU routes
walletRoutes.route("/info").get(verifyUsers,verifyUserStats,getWalletInfo)
walletRoutes.route("/deposit").post(depositUWalletValidation, verifyUsers, verifyUserStats, depositIntoUWallet)



export default walletRoutes