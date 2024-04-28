"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyUserStatus_1 = require("../middlewares/verifyUserStatus");
var verifyUser_1 = require("../middlewares/verifyUser");
var walletController_1 = require("../controllers/wallet/walletController");
var walletRoutes = express_1.default.Router();
// ForU routes
walletRoutes.route("/info").get(verifyUser_1.verifyUsers, verifyUserStatus_1.verifyUserStats, walletController_1.getWalletInfo);
exports.default = walletRoutes;
