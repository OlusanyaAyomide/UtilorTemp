import express from "express"
import { verifyUserStats } from "../middlewares/verifyUserStatus"
import { verifyUsers } from "../middlewares/verifyUser"
import { addPromoCodeValidation, createCabalValidation, createForUValidation, createUAndIValidation, depositForUValidation, sendCabalInvitationValidation, startCabalValidation } from "../validations/savingsValidation"
import { depositIntoEmergencySavings, depositIntoForUSavings, depositIntoMyCabalSaving, depositIntoUANDISavings } from "../controllers/savings/savingsDeposit"
import { createMyCabal, createNewEmergency, createNewForUplan, createNewUAndISavings } from "../controllers/savings/createSavings"
import { getAllCabalUsers, getAllUserEmergency, getAllUserForU, getAllUserUAndI, getSingleEmergency, getSingleForU } from "../controllers/savings/savingsRetrival"
import { JoinMyCabal, addPromoCodeToEmergency, addPromoCodeToUAndI, addPromoCodeToUsave, sendMyCabalInvitation, startCabalGroup } from "../controllers/savings/savingsUtils"



const savingRoutes = express.Router()

// ForU routes
savingRoutes.route("/foru/new").post(verifyUsers,verifyUserStats,createForUValidation,createNewForUplan)
savingRoutes.route("/foru/deposit").post(verifyUsers, verifyUserStats,depositForUValidation,depositIntoForUSavings)
savingRoutes.route("/foru/promocode/add").post(verifyUsers,verifyUserStats,addPromoCodeValidation,addPromoCodeToUsave)
savingRoutes.route("/foru/retrieve/all").get(verifyUsers,verifyUserStats,getAllUserForU)
savingRoutes.route("/foru/detail/:id").get(verifyUsers,verifyUserStats,getSingleForU)


// ForU routes
savingRoutes.route("/emergency/new").post(verifyUsers,verifyUserStats,createForUValidation,createNewEmergency)
savingRoutes.route("/emergency/deposit").post(verifyUsers, verifyUserStats,depositForUValidation,depositIntoEmergencySavings)
savingRoutes.route("/emergency/promocode/add").post(verifyUsers,verifyUserStats,addPromoCodeValidation,addPromoCodeToEmergency)
savingRoutes.route("/emergency/retrieve/all").get(verifyUsers,verifyUserStats,getAllUserEmergency)
savingRoutes.route("/emergency/detail/:id").get(verifyUsers,verifyUserStats,getSingleEmergency)

//UANDI
savingRoutes.route("/uandi/new").post(verifyUsers , verifyUserStats ,createUAndIValidation , createNewUAndISavings)
savingRoutes.route("/uandi/deposit").post(verifyUsers , verifyUserStats ,depositForUValidation ,depositIntoUANDISavings)
savingRoutes.route("/uandi/promocode/add").post(verifyUsers,verifyUserStats,addPromoCodeValidation,addPromoCodeToUAndI)
savingRoutes.route("/uandi/retrieve/all").get( verifyUsers,verifyUserStats,getAllUserUAndI)

//MYCABAL
savingRoutes.route("/cabal/new").post(verifyUsers,verifyUserStats,createCabalValidation,createMyCabal)
savingRoutes.route("/cabal/invitaion").post(verifyUsers,verifyUserStats,sendCabalInvitationValidation,sendMyCabalInvitation)
savingRoutes.route("/cabal/join/:id").get(verifyUsers,verifyUserStats,JoinMyCabal)
savingRoutes.route("/cabal/users/all/:id").get(verifyUsers,verifyUserStats,getAllCabalUsers)
savingRoutes.route("/cabal/deposit").post(verifyUsers,verifyUserStats,depositForUValidation,depositIntoMyCabalSaving)
savingRoutes.route("/cabal/start").post(verifyUsers,verifyUserStats,startCabalValidation,startCabalGroup)



// savingRoutes.route("/foru/withdraw").post(createForUValidation, verifyUsers,verifyUserStats,createNewForUplan)

// UWallet Routes should be moved


export default savingRoutes