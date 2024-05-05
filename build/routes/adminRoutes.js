"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyAdminStatus_1 = require("../controllers/admin/verifyAdminStatus");
var adminValidation_1 = require("../validations/adminValidation");
var promoCodeController_1 = require("../controllers/admin/promoCodeController");
var adminRoutes = express_1.default.Router();
// ForU routes
adminRoutes.route("/promocode/create").post(verifyAdminStatus_1.verifyAdminStatus, adminValidation_1.createPromoCodeValidation, promoCodeController_1.createPromoCode);
exports.default = adminRoutes;