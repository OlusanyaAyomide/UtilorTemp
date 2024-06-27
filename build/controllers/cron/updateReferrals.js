"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReferrals = void 0;
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
var TempRates_1 = require("../../utils/TempRates");
var util_1 = require("../../utils/util");
function updateReferrals(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var thirtyDaysAgo, thiryDaysAgoDateTime, users, operations, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    thirtyDaysAgo = new Date();
                    thiryDaysAgoDateTime = new Date(thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30));
                    return [4 /*yield*/, pris_client_1.default.user.findMany({
                            where: {
                                createdAt: {
                                    lte: thiryDaysAgoDateTime
                                },
                                redeemedForSelf: false,
                                hasMadeDeposit: true
                            },
                            include: { uWalletAccounts: true }
                        })];
                case 1:
                    users = _a.sent();
                    operations = users.flatMap(function (user) {
                        //if for some reasons user referral balance is less than referral amount do not decrement
                        //nor add referall erarning to their wallet
                        var userNairaWallet = user.uWalletAccounts.find((function (wallet) { return wallet.currency === "NGN"; }));
                        if (userNairaWallet && (userNairaWallet.referralBalance >= TempRates_1.referralAmount)) {
                            //move balance from referral balance to actual balanr
                            return [
                                pris_client_1.default.uWallet.update({
                                    where: { id: userNairaWallet.id },
                                    data: {
                                        referralBalance: { decrement: TempRates_1.referralAmount },
                                        balance: { increment: TempRates_1.referralAmount }
                                    }
                                }),
                                pris_client_1.default.user.update({
                                    where: { id: user.id },
                                    data: {
                                        redeemedForSelf: true
                                    }
                                })
                            ];
                        }
                        else {
                            return [];
                        }
                    });
                    return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Updated ".concat(operations.length, " users"), data: users })];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: (0, util_1.stringifyError)(err_1), code: 500 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.updateReferrals = updateReferrals;
