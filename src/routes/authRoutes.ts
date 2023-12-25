import express from "express"
import { credentialSignInValidation, googleSignUpValidation, otpvalidation, resendTokenValidation, signUpValidation, tokenVerifyValidation } from "../validations/authValidation"
import { createNewUser, credentialSignIn, googleSignUp, otpVerificationSign, reverifyToken } from "../controllers/authController"


const authRoutes = express.Router()


authRoutes.route("/signup").post(signUpValidation,createNewUser)
authRoutes.route("/verify").post(otpvalidation,tokenVerifyValidation,otpVerificationSign)
authRoutes.route("/google-signup").post(googleSignUpValidation,googleSignUp)
authRoutes.route("/signin").post(credentialSignInValidation,credentialSignIn)
authRoutes.route("/resend-token").post(resendTokenValidation,reverifyToken)

export default authRoutes