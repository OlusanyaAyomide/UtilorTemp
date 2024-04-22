"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositIntoForUSavings = exports.createNewForUplan = void 0;
var catch_async_1 = __importDefault(require("../../utils/catch-async"));
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
var util_1 = require("../../utils/util");
var requests_1 = require("../../config/requests");
var transactions_util_1 = require("../../utils/transactions.util");
exports.createNewForUplan = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, forUData, now, ending, rest, newSaving;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                forUData = req.body;
                now = new Date();
                ending = new Date(forUData.endingDate);
                // Prevent from setting ending date in the past;
                if (now >= ending) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Ending date must be in the future", code: 400 })];
                }
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                rest = __rest(forUData, []);
                return [4 /*yield*/, pris_client_1.default.uSaveForU.create({
                        data: __assign({ userId: user.userId, investmentCapital: 0, totalInvestment: 0, returnOfInvestment: 0 }, rest)
                    })];
            case 1:
                newSaving = _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, code: 200, message: "ForU savings \"".concat(forUData.savingsName, "\" created successfully") })];
        }
    });
}); });
exports.depositIntoForUSavings = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tx_ref, depositData, user, forUAccount, amount, uWallet, forUDepositGenericTransactionData, uWalletWithdrawalGenericTransactionData, newForUDepositGenericTransaction, newUWalletWithdrawalGenericTransaction, forUTransactionData, newForUTransaction, uWalletTransactionData, newUWalletTransaction, updateUWallet, updateForU, paymentInformation, paymentLink, newTransaction, newForUTransaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tx_ref = (0, util_1.generateTransactionRef)();
                depositData = req.body;
                user = req.user;
                // Verify there is indeed a valid user
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.uSaveForU.findFirst({
                        where: { id: depositData.id }
                    })];
            case 1:
                forUAccount = _a.sent();
                if (!forUAccount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 404, error: "ForU savings account not found" })];
                }
                amount = depositData.amount;
                if (!(depositData.paymentMethod === "UWALLET")) return [3 /*break*/, 24];
                return [4 /*yield*/, pris_client_1.default.uWallet.findFirst({
                        where: {
                            userId: user.userId,
                            currency: "NGN" // user can only pay in NGN
                        }
                    })];
            case 2:
                uWallet = _a.sent();
                // Respond with error if no valid wallet
                if (!uWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No U-Wallet found", code: 404 })];
                }
                // Respond with error if valid wallet has insufficient balance
                if (uWallet.balance < amount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Insufficient funds in U-Wallet", code: 400 })];
                }
                forUDepositGenericTransactionData = {
                    userId: user.userId,
                    transactionReference: tx_ref,
                    amount: depositData.amount,
                    transactionCurrency: uWallet.currency,
                    description: "FORU",
                    paymentMethod: depositData.paymentMethod,
                    transactionType: "DEPOSIT"
                };
                uWalletWithdrawalGenericTransactionData = __assign(__assign({}, forUDepositGenericTransactionData), { description: "UWALLET", transactionType: "WITHDRAWAL" });
                return [4 /*yield*/, (0, transactions_util_1.saveTransaction)(forUDepositGenericTransactionData)];
            case 3:
                newForUDepositGenericTransaction = _a.sent();
                return [4 /*yield*/, (0, transactions_util_1.saveTransaction)(uWalletWithdrawalGenericTransactionData)];
            case 4:
                newUWalletWithdrawalGenericTransaction = _a.sent();
                forUTransactionData = __assign(__assign({}, forUDepositGenericTransactionData), { uSaveForUAccountId: forUAccount.id });
                return [4 /*yield*/, (0, transactions_util_1.saveForUTransaction)(forUTransactionData)];
            case 5:
                newForUTransaction = _a.sent();
                uWalletTransactionData = __assign(__assign({}, uWalletWithdrawalGenericTransactionData), { uWalletAccountId: uWallet.id });
                return [4 /*yield*/, (0, transactions_util_1.saveUwalletTransaction)(uWalletTransactionData)];
            case 6:
                newUWalletTransaction = _a.sent();
                return [4 /*yield*/, pris_client_1.default.uWallet.update({
                        where: { id: uWallet.id },
                        data: {
                            balance: { decrement: amount }
                        }
                    })];
            case 7:
                updateUWallet = _a.sent();
                if (!!updateUWallet) return [3 /*break*/, 12];
                // Update Generic Transactions status to failed
                return [4 /*yield*/, (0, transactions_util_1.updateGenericTransactionStatus)(newUWalletWithdrawalGenericTransaction.id, "FAIL")];
            case 8:
                // Update Generic Transactions status to failed
                _a.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateGenericTransactionStatus)(newForUDepositGenericTransaction.id, "FAIL")];
            case 9:
                _a.sent();
                // Update main U-Wallet transaction to be failed
                return [4 /*yield*/, (0, transactions_util_1.updateUWalletTransactionStats)(newUWalletTransaction.id, "FAIL")];
            case 10:
                // Update main U-Wallet transaction to be failed
                _a.sent();
                // Update main For-U transaction to be failed
                return [4 /*yield*/, (0, transactions_util_1.updateForUTransactionStatus)(newForUTransaction.id, "FAIL")];
            case 11:
                // Update main For-U transaction to be failed
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 500, error: "Could not debit from U-Wallet" })];
            case 12: return [4 /*yield*/, pris_client_1.default.uSaveForU.update({
                    where: { id: forUAccount.id },
                    data: {
                        investmentCapital: { increment: amount },
                        totalInvestment: { increment: amount },
                    }
                })];
            case 13:
                updateForU = _a.sent();
                if (!!updateForU) return [3 /*break*/, 19];
                // Update Generic Transactions status to failed
                return [4 /*yield*/, (0, transactions_util_1.updateGenericTransactionStatus)(newUWalletWithdrawalGenericTransaction.id, "FAIL")];
            case 14:
                // Update Generic Transactions status to failed
                _a.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateGenericTransactionStatus)(newForUDepositGenericTransaction.id, "FAIL")];
            case 15:
                _a.sent();
                // Update main U-Wallet transaction to be failed
                return [4 /*yield*/, (0, transactions_util_1.updateUWalletTransactionStats)(newUWalletTransaction.id, "FAIL")];
            case 16:
                // Update main U-Wallet transaction to be failed
                _a.sent();
                // Update main For-U transaction to be failed
                return [4 /*yield*/, (0, transactions_util_1.updateForUTransactionStatus)(newForUTransaction.id, "FAIL")];
            case 17:
                // Update main For-U transaction to be failed
                _a.sent();
                // Reimburse U-Wallet
                return [4 /*yield*/, pris_client_1.default.uWallet.update({
                        where: { id: uWallet.id },
                        data: {
                            balance: { increment: amount }
                        }
                    })];
            case 18:
                // Reimburse U-Wallet
                _a.sent();
                // Send error response
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 500, error: "Could not credit for-U" })];
            case 19: 
            // Update Generic Transactions status to successful
            return [4 /*yield*/, (0, transactions_util_1.updateGenericTransactionStatus)(newUWalletWithdrawalGenericTransaction.id, "SUCCESS")];
            case 20:
                // Update Generic Transactions status to successful
                _a.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateGenericTransactionStatus)(newForUDepositGenericTransaction.id, "SUCCESS")];
            case 21:
                _a.sent();
                // Update main U-Wallet transaction to be successful
                return [4 /*yield*/, (0, transactions_util_1.updateUWalletTransactionStats)(newUWalletTransaction.id, "SUCCESS")];
            case 22:
                // Update main U-Wallet transaction to be successful
                _a.sent();
                // Update main For-U transaction to be successful
                return [4 /*yield*/, (0, transactions_util_1.updateForUTransactionStatus)(newForUTransaction.id, "SUCCESS")];
            case 23:
                // Update main For-U transaction to be successful
                _a.sent();
                // Return success response
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        code: 200,
                        message: "For-U account \"".concat(forUAccount.savingsName, "\" successfully funded from U-Wallet"),
                        data: {
                            uWalletBalance: updateUWallet.balance,
                            forUBalance: updateForU.totalInvestment
                        }
                    })];
            case 24:
                paymentInformation = {
                    user: user,
                    tx_ref: tx_ref,
                    amount: depositData.amount,
                    currency: "NGN", // Users can only deposit in NGN
                    product: "FORU",
                    productId: depositData.id
                };
                return [4 /*yield*/, (0, requests_1.generatePaymentLink)(paymentInformation)];
            case 25:
                paymentLink = _a.sent();
                if (!paymentLink) return [3 /*break*/, 28];
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            amount: paymentInformation.amount,
                            transactionReference: tx_ref,
                            transactionCurrency: paymentInformation.currency,
                            description: "FORU",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "DEPOSIT"
                        }
                    })];
            case 26:
                newTransaction = _a.sent();
                return [4 /*yield*/, pris_client_1.default.usaveForUTransaction.create({
                        data: {
                            amount: depositData.amount,
                            transactionType: "DEPOSIT",
                            uSaveForUAccountId: depositData.id,
                            transactionReference: tx_ref,
                            transactionStatus: "PENDING",
                            transactionCurrency: "NGN"
                        }
                    })];
            case 27:
                newForUTransaction = _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: paymentLink })];
            case 28: return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Payment link could not be generated" })];
        }
    });
}); });
