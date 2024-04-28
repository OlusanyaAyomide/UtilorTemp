import express from "express"
import { verifyUserStats } from "../middlewares/verifyUserStatus"
import { verifyUsers } from "../middlewares/verifyUser"
import { createForUValidation, createUAndIValidation, depositForUValidation, depositUWalletValidation } from "../validations/savingsValidation"
import { depositIntoForUSavings, depositIntoUANDISavings, depositIntoUWallet } from "../controllers/savings/savingsDeposit"
import { createNewForUplan, createNewUAndISavings } from "../controllers/savings/createSavings"
import { getAllUserForU, getAllUserUAndI, getSingleForU } from "../controllers/savings/savingsRetrival"



const savingRoutes = express.Router()

// ForU routes
savingRoutes.route("/foru/new").post(verifyUsers,verifyUserStats,createForUValidation,createNewForUplan)
savingRoutes.route("/foru/deposit").post(verifyUsers, verifyUserStats,depositForUValidation,depositIntoForUSavings)

savingRoutes.route("foru/retrieve/all").get(verifyUsers,verifyUserStats,getAllUserForU)
savingRoutes.route("foru/detail/:id").get(verifyUsers,verifyUserStats,getSingleForU)


savingRoutes.route("/uandi/new").post(verifyUsers , verifyUserStats ,createUAndIValidation , createNewUAndISavings)

savingRoutes.route("/uandi/deposit").post(verifyUsers , verifyUserStats ,depositForUValidation ,depositIntoUANDISavings)

savingRoutes.route("/uandi/retrieve/all").get( verifyUsers,verifyUserStats,getAllUserUAndI)



// savingRoutes.route("/foru/withdraw").post(createForUValidation, verifyUsers,verifyUserStats,createNewForUplan)

// UWallet Routes should be moved
savingRoutes.route("/uwallet/deposit").post(depositUWalletValidation, verifyUsers, verifyUserStats, depositIntoUWallet)


export default savingRoutes