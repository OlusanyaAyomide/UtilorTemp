"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authValidation_1 = require("../validations/authValidation");
var authController_1 = require("../controllers/auth/authController");
var authSetUpController_1 = require("../controllers/auth/authSetUpController");
var verifyUser_1 = require("../middlewares/verifyUser");
var verifyUserStatus_1 = require("../middlewares/verifyUserStatus");
var authRoutes = express_1.default.Router();
authRoutes.route("/signup").post(authValidation_1.signUpValidation, authController_1.createNewUser);
authRoutes.route("/verify").post(authValidation_1.otpvalidation, authController_1.mailVerification);
authRoutes.route("/basic-detail").post(authValidation_1.basicSetUpValidation, authController_1.completeBasicDetail, authSetUpController_1.credentialSignIn);
// authRoutes.route("/google-signup").post(googleSignUpValidation,googleSignUp)
// authRoutes.route("/google-signin").post(googleSignUpValidation,googleSignIn)
authRoutes.route("/signin").post(authValidation_1.credentialSignInValidation, authController_1.userLogIn, authSetUpController_1.credentialSignIn);
authRoutes.route("/resend-token").post(authValidation_1.resendTokenValidation, authController_1.reverifyToken);
// authRoutes.route("/verify-device").post(newDeviceValidation,verifyAndAddNewDevice,credentialSignIn)
authRoutes.route("/forgot-password").post(authValidation_1.forgotPasswordValidation, authController_1.forgotPassword);
authRoutes.route("/reset-password").post(authValidation_1.resetPasswordValidation, authController_1.resetPassword);
authRoutes.route("/resend-forgot-password").post(authController_1.resendForgotPassword, authController_1.resendForgotPassword);
authRoutes.route("/pin-setup").post(authValidation_1.createPinValidation, verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, authSetUpController_1.createPin);
authRoutes.route("/verification-setup").post(authValidation_1.updateBvnValidation, verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, authSetUpController_1.updateDobAndBvn);
exports.default = authRoutes;
