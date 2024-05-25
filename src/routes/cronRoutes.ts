import express from "express"
import {verifyCronJobStatus} from "../controllers/cron/VerifyCronStatus"
import {updateWallets} from "../controllers/cron/updateWallets"
import { updateReferrals } from "../controllers/cron/updateReferrals"

const cronRoutes = express.Router()

cronRoutes.route("/wallets/update").get(verifyCronJobStatus,updateWallets)
cronRoutes.route("/users/referrals").get(verifyCronJobStatus,updateReferrals)


export default cronRoutes