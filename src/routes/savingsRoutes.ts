import express from "express"
import { verifyUserStats } from "../middlewares/verifyUserStatus"
import { verifyUsers } from "../middlewares/verifyUser"
import { addPromoCodeValidation, createCabalValidation, createForUValidation, createUAndIValidation, depositForUValidation, emergencyUWithdrawalValidation, forUWithdrawalValidation, savingsInterestValidation, sendCabalInvitationValidation, startCabalValidation, uAndIValidation } from "../validations/savingsValidation"
import { depositIntoEmergencySavings, depositIntoForUSavings, depositIntoMyCabalSaving, depositIntoUANDISavings } from "../controllers/savings/savingsDeposit"
import { createMyCabal, createNewEmergency, createNewForUplan, createNewUAndISavings } from "../controllers/savings/createSavings"
import { getAllCabalUsers, getAllSavingsData, getAllSavingsInterest, getAllUserEmergency, getAllUserForU, getAllUserUAndI, getEmergencySavingsInterest, getForUSavingsInterest, getSavingsList, getSingleEmergency, getSingleForU, getSingleUANDI, getUAndISavingInterest } from "../controllers/savings/savingsRetrival"
import { JoinMyCabal, addPromoCodeToEmergency, addPromoCodeToUAndI, addPromoCodeToUsave, sendMyCabalInvitation, startCabalGroup } from "../controllers/savings/savingsUtils"
import { ForUWithdrawal, emergencywithdrawal, uAndIWithdrawal } from "../controllers/savings/savingsWithdrawal"



const savingRoutes = express.Router()

// ForU routes
savingRoutes.route("/foru/new").post(verifyUsers,verifyUserStats,createForUValidation,createNewForUplan)
savingRoutes.route("/foru/deposit").post(verifyUsers, verifyUserStats,depositForUValidation,depositIntoForUSavings)
savingRoutes.route("/foru/promocode/add").post(verifyUsers,verifyUserStats,addPromoCodeValidation,addPromoCodeToUsave)
savingRoutes.route("/foru/withdrawal").post(verifyUsers,verifyUserStats,forUWithdrawalValidation,ForUWithdrawal)
savingRoutes.route("/foru/retrieve/all").get(verifyUsers,verifyUserStats,getAllUserForU)
savingRoutes.route("/foru/interest").get(verifyUsers,verifyUserStats,savingsInterestValidation,getForUSavingsInterest)
savingRoutes.route("/foru/detail/:id").get(verifyUsers,verifyUserStats,getSingleForU)

// EMERGENCY routes
savingRoutes.route("/emergency/new").post(verifyUsers,verifyUserStats,createForUValidation,createNewEmergency)
savingRoutes.route("/emergency/deposit").post(verifyUsers, verifyUserStats,depositForUValidation,depositIntoEmergencySavings)
savingRoutes.route("/emergency/promocode/add").post(verifyUsers,verifyUserStats,addPromoCodeValidation,addPromoCodeToEmergency)
savingRoutes.route("/emergency/withdrawal").post(verifyUsers,verifyUserStats,emergencyUWithdrawalValidation,emergencywithdrawal)
savingRoutes.route("/emergency/retrieve/all").get(verifyUsers,verifyUserStats,getAllUserEmergency)
savingRoutes.route("/emergency/interest").get(verifyUsers,verifyUserStats,savingsInterestValidation,getEmergencySavingsInterest)
savingRoutes.route("/emergency/detail/:id").get(verifyUsers,verifyUserStats,getSingleEmergency)

//UANDI
savingRoutes.route("/uandi/new").post(verifyUsers , verifyUserStats ,createUAndIValidation , createNewUAndISavings)
savingRoutes.route("/uandi/deposit").post(verifyUsers , verifyUserStats ,depositForUValidation ,depositIntoUANDISavings)
savingRoutes.route("/uandi/promocode/add").post(verifyUsers,verifyUserStats,addPromoCodeValidation,addPromoCodeToUAndI)
savingRoutes.route("/uandi/withdrawal").post(verifyUsers,verifyUserStats,uAndIValidation,uAndIWithdrawal)
savingRoutes.route("/uandi/retrieve/all").get( verifyUsers,verifyUserStats,getAllUserUAndI)
savingRoutes.route("/uandi/interest").get(verifyUsers,verifyUserStats,savingsInterestValidation,getUAndISavingInterest)
savingRoutes.route("/uandi/detail/:id").get(verifyUsers,verifyUserStats,getSingleUANDI)

//MYCABAL
savingRoutes.route("/cabal/new").post(verifyUsers,verifyUserStats,createCabalValidation,createMyCabal)
savingRoutes.route("/cabal/invitaion").post(verifyUsers,verifyUserStats,sendCabalInvitationValidation,sendMyCabalInvitation)
savingRoutes.route("/cabal/join/:id").get(verifyUsers,verifyUserStats,JoinMyCabal)
savingRoutes.route("/cabal/users/all/:id").get(verifyUsers,verifyUserStats,getAllCabalUsers)
savingRoutes.route("/cabal/deposit").post(verifyUsers,verifyUserStats,depositForUValidation,depositIntoMyCabalSaving)
savingRoutes.route("/cabal/start").post(verifyUsers,verifyUserStats,startCabalValidation,startCabalGroup)
savingRoutes.route("/summary").get(verifyUsers,verifyUserStats,getAllSavingsData)
savingRoutes.route("/summary/list").get(verifyUsers,verifyUserStats,getSavingsList)
savingRoutes.route("/summary/interest").get(verifyUsers,verifyUserStats,savingsInterestValidation,getAllSavingsInterest)


export default savingRoutes