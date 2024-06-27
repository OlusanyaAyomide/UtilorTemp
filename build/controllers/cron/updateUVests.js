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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMutualFundDate = exports.updateUvestBalance = void 0;
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var util_1 = require("../../utils/util");
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
var dateUtils_1 = require("../../utils/dateUtils");
function updateUvestBalance(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var cronTracker, allMutualFunds, operations, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pris_client_1.default.cronTracker.create({
                        data: {
                            type: "U_VEST_PORTFOLIO",
                        }
                    })];
                case 1:
                    cronTracker = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, pris_client_1.default.mutualFundCompanies.findMany({
                            include: {
                                userPortfolios: {
                                    where: {
                                        isActive: true
                                    }
                                }
                            }
                        })];
                case 3:
                    allMutualFunds = _a.sent();
                    operations = allMutualFunds.flatMap(function (mutualFund) {
                        var portfolios = mutualFund.userPortfolios.flatMap(function (portfolio) {
                            var newReturn = (0, util_1.calculateDailyReturns)({ capital: portfolio.capital, interest: mutualFund.annualReturns });
                            var totalBalance = portfolio.activeBalance + newReturn;
                            var returnOfInvestment = newReturn + portfolio.returnOfInvestment;
                            return [
                                pris_client_1.default.userMutualFund.update({
                                    where: { id: portfolio.id },
                                    data: {
                                        activeBalance: totalBalance,
                                        returnOfInvestment: returnOfInvestment
                                    }
                                }),
                                pris_client_1.default.transaction.create({
                                    data: {
                                        transactionReference: (0, util_1.generateTransactionRef)(),
                                        transactionCurrency: mutualFund.currency,
                                        amount: newReturn,
                                        description: "FORU",
                                        featureId: portfolio.id,
                                        userId: portfolio.userId,
                                        transactionStatus: "SUCCESS",
                                        transactionType: "INTEREST",
                                        paymentMethod: "UWALLET",
                                    }
                                })
                            ];
                        });
                        return portfolios;
                    });
                    return [4 /*yield*/, pris_client_1.default.$transaction(operations)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Uvest updated successfully" })];
                case 5:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: (0, util_1.stringifyError)(err_1), code: 500 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.updateUvestBalance = updateUvestBalance;
function UpdateMutualFundDate(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var timeAtMidnight, retrievedMutualFunds, mutualFundDateUpdates, updatedMutualFund, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    timeAtMidnight = (0, dateUtils_1.getMidnightISODateTomorrow)();
                    console.log(timeAtMidnight);
                    return [4 /*yield*/, pris_client_1.default.mutualFundCompanies.findMany({
                            where: {
                                nextDividendDate: {
                                    lte: timeAtMidnight
                                }
                            },
                            include: {
                                userPortfolios: true
                            }
                        })];
                case 1:
                    retrievedMutualFunds = _a.sent();
                    mutualFundDateUpdates = retrievedMutualFunds.map(function (mutualFund) {
                        var nextDividendDate = (0, dateUtils_1.addDateFrequency)({ date: mutualFund.nextDividendDate, frequency: mutualFund.dividendDuration });
                        return (pris_client_1.default.mutualFundCompanies.update({
                            where: { id: mutualFund.id },
                            data: {
                                nextDividendDate: nextDividendDate
                            }
                        }));
                    });
                    updatedMutualFund = retrievedMutualFunds.flatMap(function (mutualFundCompany) {
                        var updatedPortfolios = mutualFundCompany.userPortfolios.flatMap(function (portfolio) {
                            var portfolioUpdate = pris_client_1.default.userMutualFund.update({
                                where: { id: portfolio.id },
                                data: {
                                    visibleBalance: portfolio.activeBalance,
                                    capital: !portfolio.autoRenew ? portfolio.capital : portfolio.activeBalance
                                }
                            });
                            if (portfolio.autoRenew) {
                                var portfolioUpdateTransaction = pris_client_1.default.transaction.create({
                                    data: {
                                        userId: portfolio.userId,
                                        amount: portfolio.activeBalance - portfolio.visibleBalance,
                                        transactionReference: (0, util_1.generateTransactionRef)(),
                                        transactionCurrency: mutualFundCompany.currency,
                                        description: "UVEST",
                                        paymentMethod: "UWALLET",
                                        transactionType: "DEPOSIT",
                                        featureId: portfolio.id
                                    }
                                });
                                return [portfolioUpdateTransaction, portfolioUpdate];
                            }
                            else {
                                return portfolioUpdate;
                            }
                        });
                        return updatedPortfolios;
                    });
                    //update all transactions once
                    return [4 /*yield*/, pris_client_1.default.$transaction(__spreadArray(__spreadArray([], updatedMutualFund, true), mutualFundDateUpdates, true))];
                case 2:
                    //update all transactions once
                    _a.sent();
                    return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: retrievedMutualFunds })];
                case 3:
                    err_2 = _a.sent();
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: (0, util_1.stringifyError)(err_2), code: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.UpdateMutualFundDate = UpdateMutualFundDate;
