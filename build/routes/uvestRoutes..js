"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyUserStatus_1 = require("../middlewares/verifyUserStatus");
var verifyUser_1 = require("../middlewares/verifyUser");
var uvestRetrieval_1 = require("../controllers/uvest/uvestRetrieval");
var uvestRoutes = express_1.default.Router();
// ForU routes
uvestRoutes.route("/mutual-funds/all").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, uvestRetrieval_1.getMutualFundCompanies);
uvestRoutes.route("/mutual-funds/:id").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, uvestRetrieval_1.getIndividualFundCompany);
exports.default = uvestRoutes;
