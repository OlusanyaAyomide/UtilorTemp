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
exports.MyCabalWithdrawal = exports.uAndIWithdrawal = exports.emergencywithdrawal = exports.ForUWithdrawal = void 0;
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var transactionServices_1 = require("../../services/transactionServices");
var catch_async_1 = __importDefault(require("../../utils/catch-async"));
var dateUtils_1 = require("../../utils/dateUtils");
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
var transactions_util_1 = require("../../utils/transactions.util");
var util_1 = require("../../utils/util");
exports.ForUWithdrawal = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, forUId, amount, forU, firstDepositDay, daysFromCreation, isDateCompleted, isOlderThanAMonth, userWallet, userNairaWallet, wallet_tx_amount, foru_tx_amount, isAllSavingsAmount, convertedRate, isAllSavingsAmount, interestOnWithdrawal, convertedRate, convertedInterest;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                _a = req.body, forUId = _a.forUId, amount = _a.amount;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.uSaveForU.findFirst({
                        where: { id: forUId, userId: userId }
                    })];
            case 1:
                forU = _c.sent();
                if (!forU) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Savings could not be retrieved" })];
                }
                return [4 /*yield*/, (0, transactionServices_1.getFirstDepositDay)({ userId: userId, featureId: forUId })];
            case 2:
                firstDepositDay = _c.sent();
                if (!firstDepositDay) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No deposit has been made" })];
                }
                daysFromCreation = (0, dateUtils_1.getDifferenceInDays)(forU.createdAt, (new Date()));
                isDateCompleted = (0, dateUtils_1.isGreaterThanDay)(forU.endingDate);
                isOlderThanAMonth = daysFromCreation > 30;
                if (!isOlderThanAMonth) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Savings not older than one month" })];
                }
                return [4 /*yield*/, pris_client_1.default.uWallet.findMany({ where: { userId: userId } })];
            case 3:
                userWallet = _c.sent();
                userNairaWallet = userWallet.find((function (wallet) { return wallet.currency === "NGN"; }));
                if (!userNairaWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Payment wallet can not be processed" })];
                }
                wallet_tx_amount = 0;
                foru_tx_amount = 0;
                if (!!isDateCompleted) return [3 /*break*/, 6];
                if (amount > forU.investmentCapital) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Savings account balance is less than requested balance" })];
                }
                isAllSavingsAmount = forU.investmentCapital === amount;
                return [4 /*yield*/, pris_client_1.default.uSaveForU.update({
                        where: { id: forU.id },
                        data: {
                            totalInvestment: { decrement: amount },
                            investmentCapital: { decrement: amount },
                            isCompleted: isAllSavingsAmount
                        }
                    })
                    //convert withdrawal amount to naira
                ];
            case 4:
                _c.sent();
                convertedRate = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: forU.currency, to: "NGN" });
                return [4 /*yield*/, pris_client_1.default.uWallet.update({ where: { id: userNairaWallet.id },
                        data: {
                            balance: { increment: convertedRate }
                        }
                    })];
            case 5:
                _c.sent();
                foru_tx_amount = amount;
                wallet_tx_amount = convertedRate;
                return [3 /*break*/, 9];
            case 6:
                //if completed use totalInvestment as users now have access to their investment
                //users can withdraw an amount less than their capital and corresponding investment'
                //is then calculated
                if (amount > forU.investmentCapital) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "ForU Savings account balance is less than requested balance" })];
                }
                isAllSavingsAmount = forU.investmentCapital === amount;
                interestOnWithdrawal = isAllSavingsAmount ?
                    forU.returnOfInvestment : (0, util_1.getWithdrawalInterest)({ capital: forU.investmentCapital, amount: amount, interest: forU.returnOfInvestment });
                return [4 /*yield*/, pris_client_1.default.uSaveForU.update({
                        where: { id: forUId },
                        data: {
                            totalInvestment: { decrement: (amount + interestOnWithdrawal) },
                            investmentCapital: { decrement: amount },
                            returnOfInvestment: { decrement: interestOnWithdrawal },
                            isCompleted: isAllSavingsAmount
                        }
                    })
                    //convert before updating naira wallet
                ];
            case 7:
                _c.sent();
                convertedRate = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: forU.currency, to: "NGN" });
                convertedInterest = (0, transactions_util_1.getConvertedRate)({ amount: interestOnWithdrawal, from: forU.currency, to: "NGN" });
                return [4 /*yield*/, pris_client_1.default.uWallet.update({
                        where: { id: userNairaWallet.id },
                        data: {
                            balance: { increment: convertedRate + convertedInterest }
                        }
                    })];
            case 8:
                _c.sent();
                foru_tx_amount = amount + interestOnWithdrawal;
                wallet_tx_amount = convertedRate + convertedInterest;
                _c.label = 9;
            case 9: 
            //create corresponding transactions for withdrawal from for u
            return [4 /*yield*/, pris_client_1.default.transaction.create({
                    data: {
                        userId: userId,
                        transactionReference: (0, util_1.generateTransactionRef)(),
                        amount: foru_tx_amount,
                        transactionCurrency: forU.currency,
                        description: "FORU",
                        paymentMethod: "UWALLET",
                        transactionType: "WITHDRAWAL",
                        featureId: forU.id
                    }
                })
                //create transaction for uwallet increment
            ];
            case 10:
                //create corresponding transactions for withdrawal from for u
                _c.sent();
                //create transaction for uwallet increment
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: userId,
                            transactionReference: (0, util_1.generateTransactionRef)(),
                            amount: wallet_tx_amount,
                            transactionCurrency: "NGN",
                            description: "UWALLET",
                            paymentMethod: "UWALLET",
                            transactionType: "SAVING_DEPOSIT",
                            featureId: userNairaWallet.id
                        }
                    })];
            case 11:
                //create transaction for uwallet increment
                _c.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "".concat(wallet_tx_amount, " has been added to u wallet account") })];
        }
    });
}); });
exports.emergencywithdrawal = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, emergencyId, amount, emergency, firstDepositDay, daysFromCreation, isDateCompleted, isOlderThanAMonth, userWallet, userNairaWallet, wallet_tx_amount, emergency_tx_amount, isAllSavingsAmount, convertedRate, isAllSavingsAmount, interestOnWithdrawal, convertedRate, convertedInterest;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                _a = req.body, emergencyId = _a.emergencyId, amount = _a.amount;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.emergency.findFirst({
                        where: { id: emergencyId, userId: userId }
                    })];
            case 1:
                emergency = _c.sent();
                if (!emergency) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Savings could not be retrieved" })];
                }
                return [4 /*yield*/, (0, transactionServices_1.getFirstDepositDay)({ userId: userId, featureId: emergencyId })];
            case 2:
                firstDepositDay = _c.sent();
                if (!firstDepositDay) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No deposit has been made" })];
                }
                daysFromCreation = (0, dateUtils_1.getDifferenceInDays)(emergency.createdAt, (new Date()));
                isDateCompleted = (0, dateUtils_1.isGreaterThanDay)(emergency.endingDate);
                isOlderThanAMonth = daysFromCreation > 30;
                if (!isOlderThanAMonth) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Emergency Savings not older than one month" })];
                }
                return [4 /*yield*/, pris_client_1.default.uWallet.findMany({ where: { userId: userId } })];
            case 3:
                userWallet = _c.sent();
                userNairaWallet = userWallet.find((function (wallet) { return wallet.currency === "NGN"; }));
                if (!userNairaWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Payment wallet can not be processed" })];
                }
                wallet_tx_amount = 0;
                emergency_tx_amount = 0;
                if (!!isDateCompleted) return [3 /*break*/, 6];
                if (amount > emergency.investmentCapital) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Savings account balance is less than requested balance" })];
                }
                isAllSavingsAmount = emergency.investmentCapital === amount;
                return [4 /*yield*/, pris_client_1.default.emergency.update({
                        where: { id: emergency.id },
                        data: {
                            totalInvestment: { decrement: amount },
                            investmentCapital: { decrement: amount },
                            isCompleted: isAllSavingsAmount
                        }
                    })
                    //convert withdrawal amount to naira
                ];
            case 4:
                _c.sent();
                convertedRate = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: emergency.currency, to: "NGN" });
                return [4 /*yield*/, pris_client_1.default.uWallet.update({ where: { id: userNairaWallet.id },
                        data: {
                            balance: { increment: convertedRate }
                        }
                    })];
            case 5:
                _c.sent();
                emergency_tx_amount = amount;
                wallet_tx_amount = convertedRate;
                return [3 /*break*/, 9];
            case 6:
                //if completed use totalInvestment as users now have access to their investment
                //users can withdraw an amount less than their capital and corresponding investment'
                //is then calculated
                if (amount > emergency.investmentCapital) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Savings account balance is less than requested balance" })];
                }
                isAllSavingsAmount = emergency.investmentCapital === amount;
                interestOnWithdrawal = isAllSavingsAmount ?
                    emergency.returnOfInvestment : (0, util_1.getWithdrawalInterest)({ capital: emergency.investmentCapital, amount: amount, interest: emergency.returnOfInvestment });
                return [4 /*yield*/, pris_client_1.default.emergency.update({
                        where: { id: emergencyId },
                        data: {
                            totalInvestment: { decrement: (amount + interestOnWithdrawal) },
                            investmentCapital: { decrement: amount },
                            returnOfInvestment: { decrement: interestOnWithdrawal },
                            isCompleted: isAllSavingsAmount
                        }
                    })
                    //convert before updating naira wallet
                ];
            case 7:
                _c.sent();
                convertedRate = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: emergency.currency, to: "NGN" });
                convertedInterest = (0, transactions_util_1.getConvertedRate)({ amount: interestOnWithdrawal, from: emergency.currency, to: "NGN" });
                return [4 /*yield*/, pris_client_1.default.uWallet.update({
                        where: { id: userNairaWallet.id },
                        data: {
                            balance: { increment: convertedRate + convertedInterest }
                        }
                    })];
            case 8:
                _c.sent();
                emergency_tx_amount = amount + interestOnWithdrawal;
                wallet_tx_amount = convertedRate + convertedInterest;
                _c.label = 9;
            case 9: 
            //create corresponding transactions for withdrawal from for u
            return [4 /*yield*/, pris_client_1.default.transaction.create({
                    data: {
                        userId: userId,
                        transactionReference: (0, util_1.generateTransactionRef)(),
                        amount: emergency_tx_amount,
                        transactionCurrency: emergency.currency,
                        description: "EMERGENCY",
                        paymentMethod: "UWALLET",
                        transactionType: "WITHDRAWAL",
                        featureId: emergency.id
                    }
                })
                //create transaction for uwallet increment
            ];
            case 10:
                //create corresponding transactions for withdrawal from for u
                _c.sent();
                //create transaction for uwallet increment
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: userId,
                            transactionReference: (0, util_1.generateTransactionRef)(),
                            amount: wallet_tx_amount,
                            transactionCurrency: "NGN",
                            description: "UWALLET",
                            paymentMethod: "UWALLET",
                            transactionType: "SAVING_DEPOSIT",
                            featureId: userNairaWallet.id
                        }
                    })];
            case 11:
                //create transaction for uwallet increment
                _c.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "".concat(wallet_tx_amount, " has been added to u wallet account") })];
        }
    });
}); });
exports.uAndIWithdrawal = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, uAndIId, amount, userId, uAndI, isCreator, userWallet, userNairaWallet, firstDepositDay, daysFromCreation, isDateCompleted, isOlderThanAMonth, wallet_tx_amount, uAndI_tx_amount, isAllSavingsAmount, convertedRate, isAllSavingsAmount, interestOnWithdrawal, convertedRate, convertedInterest, isAllSavingsAmount, convertedRate, isAllSavingsAmount, interestOnWithdrawal, convertedRate, convertedInterest;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = req.body, uAndIId = _a.uAndIId, amount = _a.amount;
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.uANDI.findFirst({
                        where: {
                            id: uAndIId,
                            OR: [
                                { creatorId: userId },
                                { partnerId: userId }
                            ]
                        }
                    })];
            case 1:
                uAndI = _g.sent();
                if (!uAndI) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "U And I Saving Account not found" })];
                }
                isCreator = uAndI.creatorId === userId;
                return [4 /*yield*/, pris_client_1.default.uWallet.findMany({ where: { userId: userId } })];
            case 2:
                userWallet = _g.sent();
                userNairaWallet = userWallet.find((function (wallet) { return wallet.currency === "NGN"; }));
                if (!userNairaWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Payment wallet can not be processed" })];
                }
                return [4 /*yield*/, (0, transactionServices_1.getFirstDepositDay)({ userId: userId, featureId: uAndIId })];
            case 3:
                firstDepositDay = _g.sent();
                if (!firstDepositDay) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No deposit has been made" })];
                }
                daysFromCreation = (0, dateUtils_1.getDifferenceInDays)(uAndI.createdAt, (new Date()));
                isDateCompleted = (0, dateUtils_1.isGreaterThanDay)(uAndI.endingDate);
                isOlderThanAMonth = daysFromCreation > 30;
                if (!isOlderThanAMonth) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "U And I Savings not older than one month" })];
                }
                wallet_tx_amount = 0;
                uAndI_tx_amount = 0;
                if (!isCreator) return [3 /*break*/, 10];
                if (!!isDateCompleted) return [3 /*break*/, 6];
                if (amount > uAndI.creatorCapital) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "U And I Savings account balance is less than requested balance" })];
                }
                isAllSavingsAmount = (uAndI.creatorCapital === amount) && (uAndI.partnerCapital === 0);
                return [4 /*yield*/, pris_client_1.default.uANDI.update({
                        where: { id: uAndI.id },
                        data: {
                            totalInvestmentFund: { decrement: amount },
                            creatorCapital: { decrement: amount },
                            isCompleted: isAllSavingsAmount
                        }
                    })
                    //convert withdrawal amount to naira
                ];
            case 4:
                _g.sent();
                convertedRate = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: uAndI.currency, to: "NGN" });
                return [4 /*yield*/, pris_client_1.default.uWallet.update({ where: { id: userNairaWallet.id },
                        data: {
                            balance: { increment: convertedRate }
                        }
                    })];
            case 5:
                _g.sent();
                uAndI_tx_amount = amount;
                wallet_tx_amount = convertedRate;
                return [3 /*break*/, 9];
            case 6:
                //if completed use totalInvestment as users now have access to their investment
                //users can withdraw an amount less than their capital and corresponding investment'
                //is then calculated
                if (amount > uAndI.creatorCapital) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "U and I Savings account balance is less than requested balance" })];
                }
                isAllSavingsAmount = (uAndI.creatorCapital === amount) && (uAndI.partnerCapital === 0);
                interestOnWithdrawal = isAllSavingsAmount ?
                    uAndI.creatorInvestmentReturn : (0, util_1.getWithdrawalInterest)({ capital: uAndI.creatorCapital, amount: amount, interest: uAndI.creatorInvestmentReturn });
                return [4 /*yield*/, pris_client_1.default.uANDI.update({
                        where: { id: uAndIId },
                        data: {
                            totalInvestmentFund: { decrement: (amount + interestOnWithdrawal) },
                            creatorCapital: { decrement: amount },
                            creatorInvestmentReturn: { decrement: interestOnWithdrawal },
                            isCompleted: isAllSavingsAmount,
                            totalInvestmentReturn: { decrement: interestOnWithdrawal }
                        }
                    })];
            case 7:
                _g.sent();
                convertedRate = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: uAndI.currency, to: "NGN" });
                convertedInterest = (0, transactions_util_1.getConvertedRate)({ amount: interestOnWithdrawal, from: uAndI.currency, to: "NGN" });
                return [4 /*yield*/, pris_client_1.default.uWallet.update({ where: { id: userNairaWallet.id },
                        data: {
                            balance: { increment: (convertedRate + convertedInterest) }
                        }
                    })];
            case 8:
                _g.sent();
                uAndI_tx_amount = amount;
                wallet_tx_amount = convertedRate + convertedInterest;
                _g.label = 9;
            case 9: return [3 /*break*/, 16];
            case 10:
                if (!!isDateCompleted) return [3 /*break*/, 13];
                if (amount > uAndI.partnerCapital) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "U And I Savings account balance is less than requested balance" })];
                }
                isAllSavingsAmount = (uAndI.partnerCapital === amount) && (uAndI.creatorCapital === 0);
                return [4 /*yield*/, pris_client_1.default.uANDI.update({
                        where: { id: uAndI.id },
                        data: {
                            totalInvestmentFund: { decrement: amount },
                            partnerCapital: { decrement: amount },
                            isCompleted: isAllSavingsAmount
                        }
                    })
                    //convert withdrawal amount to naira
                ];
            case 11:
                _g.sent();
                convertedRate = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: uAndI.currency, to: "NGN" });
                return [4 /*yield*/, pris_client_1.default.uWallet.update({ where: { id: userNairaWallet.id },
                        data: {
                            balance: { increment: convertedRate }
                        }
                    })];
            case 12:
                _g.sent();
                uAndI_tx_amount = amount;
                wallet_tx_amount = convertedRate;
                return [3 /*break*/, 16];
            case 13:
                //if completed use totalInvestment as users now have access to their investment
                //users can withdraw an amount less than their capital and corresponding investment'
                //is then calculated
                if (amount > uAndI.partnerCapital) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "U and I Savings account balance is less than requested balance" })];
                }
                isAllSavingsAmount = (uAndI.partnerCapital === amount) && (uAndI.creatorCapital === 0);
                interestOnWithdrawal = isAllSavingsAmount ?
                    uAndI.partnerInvestmentReturn : (0, util_1.getWithdrawalInterest)({ capital: uAndI.partnerCapital, amount: amount, interest: uAndI.partnerInvestmentReturn });
                return [4 /*yield*/, pris_client_1.default.uANDI.update({
                        where: { id: uAndIId },
                        data: {
                            totalInvestmentFund: { decrement: (amount + interestOnWithdrawal) },
                            partnerCapital: { decrement: amount },
                            partnerInvestmentReturn: { decrement: interestOnWithdrawal },
                            isCompleted: isAllSavingsAmount,
                            totalInvestmentReturn: { decrement: interestOnWithdrawal }
                        }
                    })];
            case 14:
                _g.sent();
                convertedRate = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: uAndI.currency, to: "NGN" });
                convertedInterest = (0, transactions_util_1.getConvertedRate)({ amount: interestOnWithdrawal, from: uAndI.currency, to: "NGN" });
                return [4 /*yield*/, pris_client_1.default.uWallet.update({ where: { id: userNairaWallet.id },
                        data: {
                            balance: { increment: (convertedRate + convertedInterest) }
                        }
                    })];
            case 15:
                _g.sent();
                uAndI_tx_amount = amount;
                wallet_tx_amount = convertedRate + convertedInterest;
                _g.label = 16;
            case 16: 
            // const convertedRate = getConvertedRate({amount,from:uAndI.currency,to:"NGN"})
            // const convertedInterest = getConvertedRate({amount:interestOnWithdrawal,from:emergency.currency,to:"NGN"})
            //create corresponding transactions for withdrawal from for u
            return [4 /*yield*/, pris_client_1.default.transaction.create({
                    data: {
                        userId: userId,
                        transactionReference: (0, util_1.generateTransactionRef)(),
                        amount: uAndI_tx_amount,
                        transactionCurrency: uAndI.currency,
                        description: "UANDI",
                        paymentMethod: "UWALLET",
                        transactionType: "WITHDRAWAL",
                        featureId: uAndI.id
                    }
                })
                //create transaction for uwallet increment
            ];
            case 17:
                // const convertedRate = getConvertedRate({amount,from:uAndI.currency,to:"NGN"})
                // const convertedInterest = getConvertedRate({amount:interestOnWithdrawal,from:emergency.currency,to:"NGN"})
                //create corresponding transactions for withdrawal from for u
                _g.sent();
                //create transaction for uwallet increment
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: userId,
                            transactionReference: (0, util_1.generateTransactionRef)(),
                            amount: wallet_tx_amount,
                            transactionCurrency: "NGN",
                            description: "UWALLET",
                            paymentMethod: "UWALLET",
                            transactionType: "SAVING_DEPOSIT",
                            featureId: userNairaWallet.id
                        }
                    })];
            case 18:
                //create transaction for uwallet increment
                _g.sent();
                return [4 /*yield*/, pris_client_1.default.notification.createMany({
                        data: [
                            { userId: uAndI.creatorId, description: "".concat((_c = req.user) === null || _c === void 0 ? void 0 : _c.firstName, " ").concat((_d = req.user) === null || _d === void 0 ? void 0 : _d.lastName, " Withdrawed ").concat(uAndI.currency, " ").concat(uAndI_tx_amount, " from ").concat(uAndI.Savingsname, " ") },
                            { userId: uAndI.partnerId, description: "".concat((_e = req.user) === null || _e === void 0 ? void 0 : _e.firstName, " ").concat((_f = req.user) === null || _f === void 0 ? void 0 : _f.lastName, " Withdrawed ").concat(uAndI.currency, " ").concat(uAndI_tx_amount, " from ").concat(uAndI.Savingsname, " ") },
                        ]
                    })];
            case 19:
                _g.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "".concat(wallet_tx_amount, " has been added to u wallet account") })];
        }
    });
}); });
exports.MyCabalWithdrawal = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cabalGroupId, amount, userId, userCabal, userWallet, userNairaWallet, firstDepositDay, daysFromCreation, isDateCompleted, isOlderThanAMonth, wallet_tx_amount, cabal_tx_amount, convertedRate, isAllSavingsAmount, interestOnWithdrawal, convertedRate, convertedInterest, allCabals;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, cabalGroupId = _a.cabalGroupId, amount = _a.amount;
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.userCabal.findFirst({
                        where: {
                            userId: userId,
                            cabalGroupId: cabalGroupId
                        },
                        include: {
                            cabelGroup: true
                        }
                    })];
            case 1:
                userCabal = _c.sent();
                if (!userCabal) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Cabal Group Id is invalid" })];
                }
                return [4 /*yield*/, pris_client_1.default.uWallet.findMany({ where: { userId: userId } })];
            case 2:
                userWallet = _c.sent();
                userNairaWallet = userWallet.find((function (wallet) { return wallet.currency === "NGN"; }));
                if (!userNairaWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Payment wallet can not be processed" })];
                }
                return [4 /*yield*/, (0, transactionServices_1.getFirstDepositDay)({ userId: userId, featureId: userCabal.id })];
            case 3:
                firstDepositDay = _c.sent();
                if (!firstDepositDay) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No deposit has been made" })];
                }
                daysFromCreation = (0, dateUtils_1.getDifferenceInDays)(userCabal.createdAt, (new Date()));
                isDateCompleted = (0, dateUtils_1.isGreaterThanDay)(userCabal.cabelGroup.lockedInDate);
                isOlderThanAMonth = daysFromCreation > 30;
                if (!isOlderThanAMonth) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Cabal Savings not older than one month" })];
                }
                if (amount > userCabal.cabalCapital) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Cabal saving balance is less than amount" })];
                }
                wallet_tx_amount = 0;
                cabal_tx_amount = 0;
                if (!!isDateCompleted) return [3 /*break*/, 6];
                //if user is withdrawing all capital,mark savings as completed
                //user can not witdraw investment if savings date is not complete
                return [4 /*yield*/, pris_client_1.default.userCabal.update({
                        where: { id: userCabal.id },
                        data: {
                            totalBalance: { decrement: amount },
                            cabalCapital: { decrement: amount },
                        }
                    })
                    //convert withdrawal amount to naira
                ];
            case 4:
                //if user is withdrawing all capital,mark savings as completed
                //user can not witdraw investment if savings date is not complete
                _c.sent();
                convertedRate = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: userCabal.cabelGroup.currency, to: "NGN" });
                return [4 /*yield*/, pris_client_1.default.uWallet.update({ where: { id: userNairaWallet.id },
                        data: {
                            balance: { increment: convertedRate }
                        }
                    })];
            case 5:
                _c.sent();
                cabal_tx_amount = amount;
                wallet_tx_amount = convertedRate;
                return [3 /*break*/, 9];
            case 6:
                //if completed use totalInvestment as users now have access to their investment
                //users can withdraw an amount less than their capital and corresponding investment'
                //is then calculated
                if (amount > userCabal.cabalCapital) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "U and I Savings account balance is less than requested balance" })];
                }
                isAllSavingsAmount = amount === userCabal.cabalCapital;
                interestOnWithdrawal = isAllSavingsAmount ?
                    userCabal.cabalRoI : (0, util_1.getWithdrawalInterest)({ capital: userCabal.totalBalance, amount: amount, interest: userCabal.cabalRoI });
                return [4 /*yield*/, pris_client_1.default.userCabal.update({
                        where: { id: userCabal.id },
                        data: {
                            totalBalance: { decrement: (amount + interestOnWithdrawal) },
                            cabalCapital: { decrement: amount },
                            cabalRoI: { decrement: interestOnWithdrawal },
                        }
                    })];
            case 7:
                _c.sent();
                convertedRate = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: userCabal.cabelGroup.currency, to: "NGN" });
                convertedInterest = (0, transactions_util_1.getConvertedRate)({ amount: interestOnWithdrawal, from: userCabal.cabelGroup.currency, to: "NGN" });
                return [4 /*yield*/, pris_client_1.default.uWallet.update({ where: { id: userNairaWallet.id },
                        data: {
                            balance: { increment: (convertedRate + convertedInterest) }
                        }
                    })];
            case 8:
                _c.sent();
                cabal_tx_amount = amount;
                wallet_tx_amount = convertedRate + convertedInterest;
                _c.label = 9;
            case 9: return [4 /*yield*/, pris_client_1.default.transaction.create({
                    data: {
                        userId: userId,
                        transactionReference: (0, util_1.generateTransactionRef)(),
                        amount: cabal_tx_amount,
                        transactionCurrency: userCabal.cabelGroup.currency,
                        description: "CABAL",
                        paymentMethod: "UWALLET",
                        transactionType: "WITHDRAWAL",
                        featureId: userCabal.id
                    }
                })
                //create transaction for uwallet increment
            ];
            case 10:
                _c.sent();
                //create transaction for uwallet increment
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: userId,
                            transactionReference: (0, util_1.generateTransactionRef)(),
                            amount: wallet_tx_amount,
                            transactionCurrency: "NGN",
                            description: "UWALLET",
                            paymentMethod: "UWALLET",
                            transactionType: "SAVING_DEPOSIT",
                            featureId: userNairaWallet.id
                        }
                    })];
            case 11:
                //create transaction for uwallet increment
                _c.sent();
                return [4 /*yield*/, pris_client_1.default.userCabal.findMany({
                        where: { cabalGroupId: cabalGroupId }
                    })
                    //create notifications for all
                ];
            case 12:
                allCabals = _c.sent();
                //create notifications for all
                return [4 /*yield*/, pris_client_1.default.notification.createMany({
                        data: allCabals.map(function (item) {
                            var _a, _b;
                            return {
                                userId: item.userId,
                                description: "".concat((_a = req.user) === null || _a === void 0 ? void 0 : _a.firstName, " ").concat((_b = req.user) === null || _b === void 0 ? void 0 : _b.lastName, " Withdrawed ").concat(userCabal.cabelGroup.currency, " ").concat(cabal_tx_amount, " from ").concat(userCabal.cabelGroup.groupName)
                            };
                        })
                    })];
            case 13:
                //create notifications for all
                _c.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "".concat(wallet_tx_amount, " was added to wallet") })];
        }
    });
}); });
