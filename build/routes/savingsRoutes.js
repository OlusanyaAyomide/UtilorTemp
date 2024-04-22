"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyUserStatus_1 = require("../middlewares/verifyUserStatus");
var verifyUser_1 = require("../middlewares/verifyUser");
var savingsValidation_1 = require("../validations/savingsValidation");
var savingcontroller_1 = require("../controllers/savings/savingcontroller");
var savingRoutes = express_1.default.Router();
// ForU routes
savingRoutes.route("/foru/new").post(savingsValidation_1.createForUValidation, verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingcontroller_1.createNewForUplan);
savingRoutes.route("/foru/deposit").post(savingsValidation_1.depositForUValidation, verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingcontroller_1.depositIntoForUSavings);
// savingRoutes.route("/foru/withdraw").post(createForUValidation, verifyUsers,verifyUserStats,createNewForUplan)
// UWallet Routes
savingRoutes.route("/uwallet/deposit").post(savingsValidation_1.depositUWalletValidation, verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats);
exports.default = savingRoutes;
