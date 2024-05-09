import express from "express"
import {verifyCronJobStatus} from "../controllers/cron/VerifyCronStatus"
import {updateWallets} from "../controllers/cron/updateWallets"

const cronRoutes = express.Router()

cronRoutes.route("/wallets/update").get(verifyCronJobStatus,updateWallets)


export default cronRoutes