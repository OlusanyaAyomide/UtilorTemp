import express from "express"
import { verifyUserStats } from "../middlewares/verifyUserStatus"
import { verifyUsers } from "../middlewares/verifyUser"
import { createForUValidation, depositForUValidation, depositUWalletValidation } from "../validations/savingsValidation"
import { createNewForUplan, depositIntoForUSavings, depositIntoUWallet } from "../controllers/savings/savingcontroller"



const savingRoutes = express.Router()

// ForU routes
savingRoutes.route("/foru/new").post(createForUValidation, verifyUsers,verifyUserStats,createNewForUplan)
savingRoutes.route("/foru/deposit").post(depositForUValidation, verifyUsers, verifyUserStats, depositIntoForUSavings)
// savingRoutes.route("/foru/withdraw").post(createForUValidation, verifyUsers,verifyUserStats,createNewForUplan)

// UWallet Routes
savingRoutes.route("/uwallet/deposit").post(depositUWalletValidation, verifyUsers, verifyUserStats, depositIntoUWallet)


export default savingRoutes