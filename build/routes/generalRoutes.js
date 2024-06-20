"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authValidation_1 = require("../validations/authValidation");
var newsLetter_1 = require("../controllers/general/newsLetter");
var verifyAdminStatus_1 = require("../controllers/admin/verifyAdminStatus");
var generalRoutes = express_1.default.Router();
// ForU routes
generalRoutes.route("/newsletter/subscribe").post(authValidation_1.signUpValidation, newsLetter_1.SubscribeToNewsLetter);
generalRoutes.route("/newsletter/unsubscribe").post(authValidation_1.signUpValidation, newsLetter_1.unSubscribeFromNewsLetter);
generalRoutes.route("/newsletter/list").get(verifyAdminStatus_1.verifyAdminStatus, newsLetter_1.retrieveAllSubscribers);
exports.default = generalRoutes;
