"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyUserStatus_1 = require("../middlewares/verifyUserStatus");
var verifyUser_1 = require("../middlewares/verifyUser");
var uvestRetrieval_1 = require("../controllers/uvest/uvestRetrieval");
var uvestValidation_1 = require("../validations/uvestValidation");
var UvestActions_1 = require("../controllers/uvest/UvestActions");
var UvestDeposits_1 = require("../controllers/uvest/UvestDeposits");
var uvestRoutes = express_1.default.Router();
// ForU routes
uvestRoutes.route("/mutual-funds/all").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, uvestRetrieval_1.getMutualFundCompanies);
uvestRoutes.route("/mutual-funds/:id").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, uvestRetrieval_1.getIndividualFundCompany);
uvestRoutes.route("/mutual-funds/portfolio/:id").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, uvestRetrieval_1.getUserMutualFundPortFolioDetail);
uvestRoutes.route("/mutual-funds/start").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, uvestValidation_1.startMutaulFundInvestmentValidation, UvestActions_1.startMutualFundInvestment);
uvestRoutes.route("/mutual-funds/deposit").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, uvestValidation_1.mutaulFundDepositValidation, UvestDeposits_1.depositIntoMutualFundInvestment);
exports.default = uvestRoutes;
