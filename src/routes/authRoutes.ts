import express from "express"
import { basicSetUpValidation, credentialSignInValidation, forgotPasswordValidation, googleSignUpValidation, newDeviceValidation, otpvalidation, resendTokenValidation, resetPasswordValidation, signUpValidation } from "../validations/authValidation"
import { completeBasicDetail, createNewUser, forgotPassword, googleSignIn, googleSignUp, mailVerification,resetPassword, reverifyToken, userLogIn, verifyAndAddNewDevice } from "../controllers/auth/authController"
import { credentialSignIn } from "../controllers/auth/authSetUpController"


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

export default authRoutes