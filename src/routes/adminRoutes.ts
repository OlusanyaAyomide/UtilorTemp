import express from "express"
import { verifyAdminStatus } from "../controllers/admin/verifyAdminStatus"
import { createPromoCodeValidation } from "../validations/adminValidation"
import { createPromoCode } from "../controllers/admin/promoCodeController"
import { createUvestValidation, updateUVestRateValidation, updateUnitPriceValidation } from "../validations/uvestValidation"
import { createNewUvestFund } from "../controllers/admin/uvest"
import { updateAnnualReturns, updateMutualFundUnitPrice } from "../controllers/uvest/UvestActions"
import { getAllMutualFundDetails } from "../controllers/admin/adminRetrieval"


const adminRoutes = express.Router()

// ForU route
adminRoutes.route("/promocode/create").post(verifyAdminStatus,createPromoCodeValidation,createPromoCode)
adminRoutes.route("/uvest/create").post(verifyAdminStatus,createUvestValidation,createNewUvestFund)
adminRoutes.route("/uvest/update-rate").post(verifyAdminStatus,updateUVestRateValidation,updateAnnualReturns)
adminRoutes.route("/uvest/update-unit-price").post(verifyAdminStatus,updateUnitPriceValidation,updateMutualFundUnitPrice)
adminRoutes.route("/uvest/all").get(verifyAdminStatus,getAllMutualFundDetails)


export default adminRoutes