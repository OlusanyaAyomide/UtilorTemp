"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authValidation_1 = require("../validations/authValidation");
var authController_1 = require("../controllers/authController");
var authRoutes = express_1.default.Router();
authRoutes.route("/signup").post(authValidation_1.signUpValidation, authController_1.createNewUser);
authRoutes.route("/verify").post(authValidation_1.otpvalidation, authValidation_1.tokenVerifyValidation, authController_1.otpVerificationSign);
authRoutes.route("/google-signup").post(authValidation_1.googleSignUpValidation, authController_1.googleSignUp);
authRoutes.route("/signin").post(authValidation_1.credentialSignInValidation, authController_1.credentialSignIn);
authRoutes.route("/resend-token").post(authValidation_1.resendTokenValidation, authController_1.reverifyToken);
exports.default = authRoutes;
