import express from "express"
import { verifyAdminStatus } from "../controllers/admin/verifyAdminStatus"
import { createPromoCodeValidation } from "../validations/adminValidation"
import { createPromoCode } from "../controllers/admin/promoCodeController"
import { createUvestValidation } from "../validations/uvestValidation"
import { createNewUvestFund } from "../controllers/admin/uvest"


const adminRoutes = express.Router()

// ForU route
adminRoutes.route("/promocode/create").post(verifyAdminStatus,createPromoCodeValidation,createPromoCode)
adminRoutes.route("/uvest/create").post(verifyAdminStatus,createUvestValidation,createNewUvestFund)


export default adminRoutes