import express from "express"
import { basicSetUpValidation, createPinValidation, credentialSignInValidation, forgotPasswordValidation, googleSignUpValidation, newDeviceValidation, otpvalidation, resendTokenValidation, resetPasswordValidation, signUpValidation, updateBvnValidation } from "../validations/authValidation"
import { completeBasicDetail, createNewUser, forgotPassword, googleSignIn, googleSignUp, mailVerification,resetPassword, reverifyToken, userLogIn, verifyAndAddNewDevice } from "../controllers/auth/authController"
import { createPin, credentialSignIn, updateDobAndBvn } from "../controllers/auth/authSetUpController"
import { verifyUsers } from "../middlewares/verifyUser"
import { verifyUserStats } from "../middlewares/verifyUserStatus"


const authRoutes = express.Router()

authRoutes.route("/signup").post(signUpValidation,createNewUser)
authRoutes.route("/verify").post(otpvalidation,mailVerification)
authRoutes.route("/basic-detail").post(basicSetUpValidation,completeBasicDetail,credentialSignIn)
authRoutes.route("/google-signup").post(googleSignUpValidation,googleSignUp)
authRoutes.route("/google-signin").post(googleSignUpValidation,googleSignIn)
authRoutes.route("/signin").post(credentialSignInValidation,userLogIn,credentialSignIn)
authRoutes.route("/resend-token").post(resendTokenValidation,reverifyToken)
authRoutes.route("/verify-device").post(newDeviceValidation,verifyAndAddNewDevice,credentialSignIn)
authRoutes.route("/forgot-password").post(forgotPasswordValidation,forgotPassword)
authRoutes.route("/reset-password").post(resetPasswordValidation,resetPassword)
authRoutes.route("/pin-setup").post(createPinValidation, verifyUsers,verifyUserStats,createPin)
authRoutes.route("/verification-setup").post(updateBvnValidation,verifyUsers,verifyUserStats,updateDobAndBvn)

export default authRoutes