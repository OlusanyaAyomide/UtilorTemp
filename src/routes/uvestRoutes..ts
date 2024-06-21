import express from "express"
import { verifyUserStats } from "../middlewares/verifyUserStatus"
import { verifyUsers } from "../middlewares/verifyUser"
import { getMutualFundCompanies,getIndividualFundCompany } from "../controllers/uvest/uvestRetrieval"




const uvestRoutes = express.Router()

// ForU routes
uvestRoutes.route("/mutual-funds/all").get(verifyUsers,verifyUserStats,getMutualFundCompanies)
uvestRoutes.route("/mutual-funds/:id").get(verifyUsers,verifyUserStats,getIndividualFundCompany)






export default uvestRoutes