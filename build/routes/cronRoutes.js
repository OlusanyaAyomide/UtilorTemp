"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var VerifyCronStatus_1 = require("../controllers/cron/VerifyCronStatus");
var updateWallets_1 = require("../controllers/cron/updateWallets");
var updateReferrals_1 = require("../controllers/cron/updateReferrals");
var cronRoutes = express_1.default.Router();
cronRoutes.route("/wallets/update").get(VerifyCronStatus_1.verifyCronJobStatus, updateWallets_1.updateWallets);
cronRoutes.route("/users/referrals").get(VerifyCronStatus_1.verifyCronJobStatus, updateReferrals_1.updateReferrals);
exports.default = cronRoutes;
