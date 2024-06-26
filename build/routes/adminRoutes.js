"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyAdminStatus_1 = require("../controllers/admin/verifyAdminStatus");
var adminValidation_1 = require("../validations/adminValidation");
var promoCodeController_1 = require("../controllers/admin/promoCodeController");
var uvestValidation_1 = require("../validations/uvestValidation");
var uvest_1 = require("../controllers/admin/uvest");
var UvestActions_1 = require("../controllers/uvest/UvestActions");
var adminRetrieval_1 = require("../controllers/admin/adminRetrieval");
var adminRoutes = express_1.default.Router();
// ForU route
adminRoutes.route("/promocode/create").post(verifyAdminStatus_1.verifyAdminStatus, adminValidation_1.createPromoCodeValidation, promoCodeController_1.createPromoCode);
adminRoutes.route("/uvest/create").post(verifyAdminStatus_1.verifyAdminStatus, uvestValidation_1.createUvestValidation, uvest_1.createNewUvestFund);
adminRoutes.route("/uvest/update-rate").post(verifyAdminStatus_1.verifyAdminStatus, uvestValidation_1.updateUVestRateValidation, UvestActions_1.updateAnnualReturns);
adminRoutes.route("/uvest/update-unit-price").post(verifyAdminStatus_1.verifyAdminStatus, uvestValidation_1.updateUnitPriceValidation, UvestActions_1.updateMutualFundUnitPrice);
adminRoutes.route("/uvest/all").get(verifyAdminStatus_1.verifyAdminStatus, adminRetrieval_1.getAllMutualFundDetails);
exports.default = adminRoutes;
