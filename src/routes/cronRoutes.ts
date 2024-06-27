import express from "express"
import {verifyCronJobStatus} from "../controllers/cron/VerifyCronStatus"
import {updateWallets} from "../controllers/cron/updateWallets"
import { updateReferrals } from "../controllers/cron/updateReferrals"
import { deletePromoCodes } from "../controllers/cron/deletePromoCodes"
import { UpdateMutualFundDate, updateUvestBalance } from "../controllers/cron/updateUVests"

const cronRoutes = express.Router()

cronRoutes.route("/wallets/update").get(verifyCronJobStatus,updateWallets)
cronRoutes.route("/users/referrals").get(verifyCronJobStatus,updateReferrals)
cronRoutes.route("/promocodes/delete").get(verifyCronJobStatus,deletePromoCodes)
cronRoutes.route("/uvest/portfolio-update").get(verifyCronJobStatus,updateUvestBalance)
cronRoutes.route("/uvest/mutualfund-update").get(verifyCronJobStatus,UpdateMutualFundDate)


export default cronRoutes