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
var savingsUtils_1 = require("../controllers/savings/savingsUtils");
var savingRoutes = express_1.default.Router();
// ForU routes
savingRoutes.route("/foru/new").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.createForUValidation, createSavings_1.createNewForUplan);
savingRoutes.route("/foru/deposit").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.depositForUValidation, savingsDeposit_1.depositIntoForUSavings);
savingRoutes.route("/foru/promocode/add").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.addPromoCodeValidation, savingsUtils_1.addPromoCodeToUsave);
savingRoutes.route("/foru/retrieve/all").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsRetrival_1.getAllUserForU);
savingRoutes.route("/foru/detail/:id").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsRetrival_1.getSingleForU);
// ForU routes
savingRoutes.route("/emergency/new").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.createForUValidation, createSavings_1.createNewEmergency);
savingRoutes.route("/emergency/deposit").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.depositForUValidation, savingsDeposit_1.depositIntoEmergencySavings);
savingRoutes.route("/emergency/promocode/add").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.addPromoCodeValidation, savingsUtils_1.addPromoCodeToEmergency);
savingRoutes.route("/emergency/retrieve/all").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsRetrival_1.getAllUserEmergency);
savingRoutes.route("/emergency/detail/:id").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsRetrival_1.getSingleEmergency);
//UANDI
savingRoutes.route("/uandi/new").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.createUAndIValidation, createSavings_1.createNewUAndISavings);
savingRoutes.route("/uandi/deposit").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.depositForUValidation, savingsDeposit_1.depositIntoUANDISavings);
savingRoutes.route("/uandi/promocode/add").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.addPromoCodeValidation, savingsUtils_1.addPromoCodeToUAndI);
savingRoutes.route("/uandi/retrieve/all").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsRetrival_1.getAllUserUAndI);
//MYCABAL
savingRoutes.route("/cabal/new").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.createCabalValidation, createSavings_1.createMyCabal);
savingRoutes.route("/cabal/invitaion").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.sendCabalInvitationValidation, savingsUtils_1.sendMyCabalInvitation);
savingRoutes.route("/cabal/join/:id").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsUtils_1.JoinMyCabal);
savingRoutes.route("/cabal/users/all/:id").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsRetrival_1.getAllCabalUsers);
savingRoutes.route("/cabal/deposit").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.depositForUValidation, savingsDeposit_1.depositIntoMyCabalSaving);
savingRoutes.route("/cabal/start").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsValidation_1.startCabalValidation, savingsUtils_1.startCabalGroup);
savingRoutes.route("/summary").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsRetrival_1.getAllSavingsData);
savingRoutes.route("/summary/list").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, savingsRetrival_1.getSavingsList);
// savingRoutes.route("/foru/withdraw").post(createForUValidation, verifyUsers,verifyUserStats,createNewForUplan)
// UWallet Routes should be moved
exports.default = savingRoutes;
