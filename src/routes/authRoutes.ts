import express from "express"
import { credentialSignInValidation, forgotPasswordValidation, googleSignUpValidation, newDeviceValidation, otpvalidation, resendTokenValidation, resetPasswordValidation, signUpValidation, tokenVerifyValidation } from "../validations/authValidation"
import { createNewUser, credentialSignIn, forgotPassword, googleSignIn, googleSignUp, otpVerificationSign, resetPassword, reverifyToken, verifyAndAddNewDevice } from "../controllers/authController"


const authRoutes = express.Router()

authRoutes.route("/signup").post(signUpValidation,createNewUser)
authRoutes.route("/verify").post(otpvalidation,tokenVerifyValidation,otpVerificationSign)
authRoutes.route("/google-signup").post(googleSignUpValidation,googleSignUp)
authRoutes.route("/google-signin").post(googleSignUpValidation,googleSignIn)
authRoutes.route("/signin").post(credentialSignInValidation,credentialSignIn)
authRoutes.route("/resend-token").post(resendTokenValidation,reverifyToken)
authRoutes.route("/verify-device").post(newDeviceValidation,verifyAndAddNewDevice)
authRoutes.route("/forgot-password").post(forgotPasswordValidation,forgotPassword)
authRoutes.route("/reset-password").post(resetPasswordValidation,resetPassword)

export default authRoutes