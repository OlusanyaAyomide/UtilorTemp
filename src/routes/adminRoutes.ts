import express from "express"
import { verifyAdminStatus } from "../controllers/admin/verifyAdminStatus"
import { createPromoCodeValidation } from "../validations/adminValidation"
import { createPromoCode } from "../controllers/admin/promoCodeController"


const adminRoutes = express.Router()

// ForU routes
adminRoutes.route("/promocode/create").post(verifyAdminStatus,createPromoCodeValidation,createPromoCode)


export default adminRoutes