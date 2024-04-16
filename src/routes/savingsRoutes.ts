import express from "express"
import { verifyUserStats } from "../middlewares/verifyUserStatus"
import { verifyUsers } from "../middlewares/verifyUser"
import { createForUValidation, depositForUValidation } from "../validations/savingsValidation"
import { createNewForUplan, depositIntoForUSavings } from "../controllers/savings/savingcontroller"



const savingRoutes = express.Router()


savingRoutes.route("/foru/new").post(createForUValidation, verifyUsers,verifyUserStats,createNewForUplan)
savingRoutes.route("/foru/deposit").post(depositForUValidation, verifyUsers, verifyUserStats, depositIntoForUSavings)
savingRoutes.route("/foru/withdraw").post(createForUValidation, verifyUsers,verifyUserStats,createNewForUplan)


export default savingRoutes