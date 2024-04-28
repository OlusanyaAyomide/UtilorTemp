"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyUserStatus_1 = require("../middlewares/verifyUserStatus");
var verifyUser_1 = require("../middlewares/verifyUser");
var userValidation_1 = require("../validations/userValidation");
var userController_1 = require("../controllers/user/userController");
var userRoutes = express_1.default.Router();
// ForU routes
userRoutes.route("/consent-token/create").post(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, userValidation_1.createConsentValidation, userController_1.createConsentToken);
userRoutes.route("/consent-token/retrieve").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, userController_1.retrieveConsentToken);
exports.default = userRoutes;
