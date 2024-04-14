import express from "express"
import { verifyUserStats } from "../middlewares/verifyUserStatus"
import { verifyUsers } from "../middlewares/verifyUser"
import { createForUValidation } from "../validations/savingsValidation"
import { createNewForUplan } from "../controllers/savings/savingcontroller"



const savingRoutes = express.Router()


savingRoutes.route("/foru/new").post(createForUValidation, verifyUsers,verifyUserStats,createNewForUplan)


export default savingRoutes