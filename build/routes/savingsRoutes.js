"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyUserStatus_1 = require("../middlewares/verifyUserStatus");
var verifyUser_1 = require("../middlewares/verifyUser");
var savingsValidation_1 = require("../validations/savingsValidation");
var savingsDeposit_1 = require("../controllers/savings/savingsDeposit");
var createSavings_1 = require("../controllers/savings/createSavings");
var savingsRetrival_1 = require("../controllers/savings/savingsRetrival");
var savingRoutes = express_1.default.Router();
// ForU routes
savingRoutes.route("/foru/new").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.createForUValidation, createSavings_1.createNewForUplan);
savingRoutes.route("/foru/deposit").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.depositForUValidation, savingsDeposit_1.depositIntoForUSavings);
savingRoutes.route("foru/retrieve/all").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsRetrival_1.getAllUserForU);
savingRoutes.route("foru/detail/:id").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsRetrival_1.getSingleForU);
savingRoutes.route("/uandi/new").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.createUAndIValidation, createSavings_1.createNewUAndISavings);
savingRoutes.route("/uandi/deposit").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.depositForUValidation, savingsDeposit_1.depositIntoUANDISavings);
savingRoutes.route("/uandi/retrieve/all").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsRetrival_1.getAllUserUAndI);
// savingRoutes.route("/foru/withdraw").post(createForUValidation, verifyUsers,verifyUserStats,createNewForUplan)
// UWallet Routes should be moved
savingRoutes.route("/uwallet/deposit").post(savingsValidation_1.depositUWalletValidation, verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsDeposit_1.depositIntoUWallet);
exports.default = savingRoutes;
