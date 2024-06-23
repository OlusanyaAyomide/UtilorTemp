import express from "express"
import { verifyUserStats } from "../middlewares/verifyUserStatus"
import { verifyUsers } from "../middlewares/verifyUser"
import { getMutualFundCompanies,getIndividualFundCompany, getUserMutualFundPortFolioDetail } from "../controllers/uvest/uvestRetrieval"
import { mutaulFundDepositValidation, startMutaulFundInvestmentValidation } from "../validations/uvestValidation"
import { startMutualFundInvestment } from "../controllers/uvest/UvestActions"
import { depositIntoMutualFundInvestment } from "../controllers/uvest/UvestDeposits"




const uvestRoutes = express.Router()

// ForU routes
uvestRoutes.route("/mutual-funds/all").get(verifyUsers,verifyUserStats,getMutualFundCompanies)
uvestRoutes.route("/mutual-funds/:id").get(verifyUsers,verifyUserStats,getIndividualFundCompany)
uvestRoutes.route("/mutual-funds/portfolio/:id").get(verifyUsers,verifyUserStats,getUserMutualFundPortFolioDetail)
uvestRoutes.route("/mutual-funds/start").post(verifyUsers,verifyUserStats,startMutaulFundInvestmentValidation,startMutualFundInvestment)
uvestRoutes.route("/mutual-funds/deposit").post(verifyUsers,verifyUserStats,mutaulFundDepositValidation,depositIntoMutualFundInvestment)



export default uvestRoutes