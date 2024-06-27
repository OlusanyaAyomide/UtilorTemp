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
exports.depositIntoMutualFundInvestment = void 0;
var requests_1 = require("../../config/requests");
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var catch_async_1 = __importDefault(require("../../utils/catch-async"));
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
var transactions_util_1 = require("../../utils/transactions.util");
var util_1 = require("../../utils/util");
exports.depositIntoMutualFundInvestment = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var depositData, user, mutualFundCompany, userPortfolio, isPinValid, tx_ref, amount, amountToDebit, userNairaWallet, updatedWallet, updatedFund, paymentInformation, paymentLink, newTransaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                depositData = req.body;
                user = req.user;
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.mutualFundCompanies.findFirst({
                        where: { id: depositData.mutualId },
                        include: {
                            userPortfolios: {
                                where: {
                                    userId: user.userId
                                },
                                include: { user: true }
                            },
                        },
                    })];
            case 1:
                mutualFundCompany = _a.sent();
                if (!mutualFundCompany) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Mutual Fund Company not found" })];
                }
                //If portfolio is empty , then there is no corresponding investment from user
                if (!mutualFundCompany.userPortfolios.length) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No Investment for this company is found" })];
                }
                userPortfolio = mutualFundCompany.userPortfolios[0];
                return [4 /*yield*/, (0, util_1.bcryptCompare)({ hashedPassword: userPortfolio.user.pin, password: depositData.pin })];
            case 2:
                isPinValid = _a.sent();
                if (!isPinValid) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Entered Pin is Invalid" })];
                }
                tx_ref = (0, util_1.generateTransactionRef)();
                amount = depositData.numberOfUnits * mutualFundCompany.unitPrice;
                amountToDebit = (0, transactions_util_1.getConvertedRate)({ from: mutualFundCompany.currency, to: "NGN", amount: amount });
                if (!(depositData.paymentMethod === "UWALLET")) return [3 /*break*/, 8];
                return [4 /*yield*/, pris_client_1.default.uWallet.findFirst({
                        where: {
                            userId: user.userId,
                            currency: "NGN"
                        }
                    })];
            case 3:
                userNairaWallet = _a.sent();
                if (!userNairaWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No U-Wallet found", code: 400 })];
                }
                console.log(amountToDebit, "Debit amount");
                if (userNairaWallet.balance < amountToDebit) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Insufficient funds in U-Wallet", code: 400 })];
                }
                return [4 /*yield*/, pris_client_1.default.uWallet.update({
                        where: { id: userNairaWallet.id },
                        data: {
                            balance: { decrement: amountToDebit }
                        }
                    })
                    //update balance with actual account        
                ];
            case 4:
                updatedWallet = _a.sent();
                return [4 /*yield*/, pris_client_1.default.userMutualFund.update({
                        where: { id: userPortfolio.id },
                        data: {
                            capital: { increment: amount },
                            activeBalance: { increment: amount },
                            visibleBalance: { increment: amount },
                            isActive: true,
                        }
                    })];
            case 5:
                updatedFund = _a.sent();
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            transactionReference: tx_ref,
                            amount: amountToDebit,
                            transactionCurrency: userNairaWallet.currency,
                            description: "UWALLET",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "WITHDRAWAL",
                            featureId: userNairaWallet.id
                        }
                    })];
            case 6:
                _a.sent();
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            transactionReference: tx_ref,
                            amount: amount,
                            transactionCurrency: mutualFundCompany.currency,
                            description: "UVEST",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "DEPOSIT",
                            featureId: userPortfolio.id
                        }
                    })];
            case 7:
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Successfully deposited ".concat(depositData.numberOfUnits, " units into ").concat(mutualFundCompany.companyName),
                        data: {
                            uWalletBalance: updatedWallet.balance,
                            totalUnits: (updatedFund.visibleBalance / mutualFundCompany.unitPrice)
                        } })];
            case 8:
                paymentInformation = {
                    user: user,
                    tx_ref: tx_ref,
                    amount: amountToDebit,
                    currency: "NGN",
                    product: "UVEST",
                    productId: mutualFundCompany.id
                };
                return [4 /*yield*/, (0, requests_1.generatePaymentLink)(paymentInformation)];
            case 9:
                paymentLink = _a.sent();
                if (!paymentLink) return [3 /*break*/, 11];
                console.log(paymentInformation.amount);
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            amount: paymentInformation.amount,
                            transactionReference: tx_ref,
                            transactionCurrency: paymentInformation.currency,
                            description: "UVEST",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "DEPOSIT",
                            featureId: userPortfolio.id
                        }
                    })];
            case 10:
                newTransaction = _a.sent();
                console.log("_____________ ".concat(newTransaction.transactionReference, "___________"));
                if (!newTransaction) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Transaction could not be initialized", code: 500 })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: paymentLink })];
            case 11: return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Payment link could not be generated" })];
        }
    });
}); });
