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
exports.depositIntoEmergencySavings = exports.depositIntoMyCabalSaving = exports.depositIntoUANDISavings = exports.depositIntoForUSavings = void 0;
var catch_async_1 = __importDefault(require("../../utils/catch-async"));
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
var util_1 = require("../../utils/util");
var requests_1 = require("../../config/requests");
var transactions_util_1 = require("../../utils/transactions.util");
exports.depositIntoForUSavings = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tx_ref, depositData, user, forUAccount, amount, uWallet, depositAmount, newForUDepositTransaction, newUWalletWithdrawalTransaction, updateUWallet, updateForU, paymentInformation, paymentLink, newTransaction;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
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
                forUAccount = _b.sent();
                if (!forUAccount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 404, error: "ForU savings account not found" })];
                }
                //confirm user is allowed to make deposit
                if (forUAccount.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Not allowed to make this forUDeposit" })];
                }
                amount = depositData.amount;
                if (!(depositData.paymentMethod === "UWALLET")) return [3 /*break*/, 12];
                return [4 /*yield*/, pris_client_1.default.uWallet.findFirst({
                        where: {
                            userId: user.userId,
                            currency: "NGN" // user can only pay in NGN
                        }
                    })];
            case 2:
                uWallet = _b.sent();
                // Respond with error if no valid wallet
                if (!uWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No U-Wallet found", code: 400 })];
                }
                depositAmount = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: uWallet.currency, to: forUAccount.currency });
                // Respond with error if valid wallet has insufficient balance
                if (uWallet.balance < depositData.amount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Insufficient funds in U-Wallet", code: 400 })];
                }
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            transactionReference: tx_ref,
                            amount: depositData.amount,
                            transactionCurrency: uWallet.currency,
                            description: "FORU",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "DEPOSIT",
                            featureId: forUAccount.id
                        }
                    })
                    //create a withdrawal transaction in the wallet
                ];
            case 3:
                newForUDepositTransaction = _b.sent();
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            transactionReference: tx_ref,
                            amount: depositData.amount,
                            transactionCurrency: uWallet.currency,
                            description: "UWALLET",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "WITHDRAWAL",
                            featureId: uWallet.id
                        }
                    })
                    // Remove from wallet
                ];
            case 4:
                newUWalletWithdrawalTransaction = _b.sent();
                return [4 /*yield*/, pris_client_1.default.uWallet.update({
                        where: { id: uWallet.id },
                        data: {
                            balance: { decrement: depositData.amount }
                        }
                    })];
            case 5:
                updateUWallet = _b.sent();
                if (!!updateUWallet) return [3 /*break*/, 8];
                // Update Transactions status to failed
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newUWalletWithdrawalTransaction.id, "FAIL")];
            case 6:
                // Update Transactions status to failed
                _b.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newForUDepositTransaction.id, "FAIL")];
            case 7:
                _b.sent();
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 500, error: "Could not debit from U-Wallet" })];
            case 8: return [4 /*yield*/, pris_client_1.default.uSaveForU.update({
                    where: { id: forUAccount.id },
                    data: {
                        investmentCapital: { increment: depositAmount },
                        totalInvestment: { increment: depositAmount },
                        isActivated: true
                    }
                })];
            case 9:
                updateForU = _b.sent();
                // Update Generic Transactions status to successful
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newUWalletWithdrawalTransaction.id, "SUCCESS")];
            case 10:
                // Update Generic Transactions status to successful
                _b.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newForUDepositTransaction.id, "SUCCESS")];
            case 11:
                _b.sent();
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
            case 12:
                paymentInformation = {
                    user: user,
                    tx_ref: tx_ref,
                    amount: depositData.amount,
                    currency: "NGN", // Users can only deposit in NGN
                    product: "FORU",
                    productId: depositData.id
                };
                return [4 /*yield*/, (0, requests_1.generatePaymentLink)(paymentInformation)];
            case 13:
                paymentLink = _b.sent();
                if (!paymentLink) return [3 /*break*/, 15];
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            amount: paymentInformation.amount,
                            transactionReference: tx_ref,
                            transactionCurrency: paymentInformation.currency,
                            description: "FORU",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "DEPOSIT",
                            featureId: forUAccount.id
                        }
                    })];
            case 14:
                newTransaction = _b.sent();
                console.log("_____________ ".concat(newTransaction.transactionReference, "___________"));
                if (!newTransaction) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Transaction could not be initialized", code: 500 })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: paymentLink })];
            case 15: return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Payment link could not be generated" })];
        }
    });
}); });
exports.depositIntoUANDISavings = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tx_ref, depositData, user, uAndISaving, amount, uWallet, depositAmount, newUandITransaction, newUWalletWithdrawalTransaction, updateUWallet, isUserCreator, updatedUAndI, paymentInformation, paymentLink, newTransaction;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                tx_ref = (0, util_1.generateTransactionRef)();
                depositData = req.body;
                user = req.user;
                // Verify there is indeed a valid user
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.uANDI.findFirst({
                        where: { id: depositData.id }
                    })];
            case 1:
                uAndISaving = _d.sent();
                if (!uAndISaving) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 404, error: "U And I savings account not found" })];
                }
                //confirm user is valid to make deposit
                if ((uAndISaving.creatorId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) && (uAndISaving.partnerId !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId))) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Not permitted to make deposit" })];
                }
                amount = depositData.amount;
                if (!(depositData.paymentMethod === "UWALLET")) return [3 /*break*/, 16];
                return [4 /*yield*/, pris_client_1.default.uWallet.findFirst({
                        where: {
                            userId: user.userId,
                            currency: "NGN" // user can only pay in NGN
                        }
                    })];
            case 2:
                uWallet = _d.sent();
                // Respond with error if no valid wallet
                if (!uWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No U-Wallet found", code: 400 })];
                }
                depositAmount = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: uWallet.currency, to: uAndISaving.currency });
                // Respond with error if valid wallet has insufficient balance
                if (uWallet.balance < depositData.amount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Insufficient funds in U-Wallet", code: 400 })];
                }
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            transactionReference: tx_ref,
                            amount: depositData.amount,
                            transactionCurrency: uWallet.currency,
                            description: "UANDI",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "DEPOSIT",
                            featureId: uAndISaving.id
                        }
                    })
                    //create a withdrawal transaction in the wallet
                ];
            case 3:
                newUandITransaction = _d.sent();
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            transactionReference: tx_ref,
                            amount: depositData.amount,
                            transactionCurrency: uWallet.currency,
                            description: "UWALLET",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "WITHDRAWAL",
                            featureId: uWallet.id
                        }
                    })
                    // Remove actual value  from wallet
                ];
            case 4:
                newUWalletWithdrawalTransaction = _d.sent();
                return [4 /*yield*/, pris_client_1.default.uWallet.update({
                        where: { id: uWallet.id },
                        data: {
                            balance: { decrement: depositData.amount }
                        }
                    })];
            case 5:
                updateUWallet = _d.sent();
                if (!!updateUWallet) return [3 /*break*/, 8];
                // Update Transactions status to failed
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newUandITransaction.id, "FAIL")];
            case 6:
                // Update Transactions status to failed
                _d.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newUWalletWithdrawalTransaction.id, "FAIL")];
            case 7:
                _d.sent();
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 500, error: "Could not debit from U-Wallet" })];
            case 8:
                isUserCreator = uAndISaving.creatorId === ((_c = req.user) === null || _c === void 0 ? void 0 : _c.userId);
                updatedUAndI = uAndISaving;
                if (!isUserCreator) return [3 /*break*/, 10];
                return [4 /*yield*/, pris_client_1.default.uANDI.update({
                        where: { id: uAndISaving.id },
                        data: {
                            creatorCapital: { increment: depositAmount },
                            totalCapital: { increment: depositAmount },
                            isActivated: true
                        }
                    })];
            case 9:
                updatedUAndI = _d.sent();
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, pris_client_1.default.uANDI.update({
                    where: { id: uAndISaving.id },
                    data: {
                        partnerCapital: { increment: depositAmount },
                        totalCapital: { increment: depositAmount },
                        isActivated: true
                    }
                })];
            case 11:
                updatedUAndI = _d.sent();
                _d.label = 12;
            case 12: 
            // Update Generic Transactions status to successful
            return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newUWalletWithdrawalTransaction.id, "SUCCESS")];
            case 13:
                // Update Generic Transactions status to successful
                _d.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newUandITransaction.id, "SUCCESS")];
            case 14:
                _d.sent();
                //create notification for both users
                return [4 /*yield*/, pris_client_1.default.notification.createMany({
                        data: [
                            { userId: updatedUAndI.creatorId, description: "".concat(req.user.firstName, " ").concat(req.user.lastName, " Deposited ").concat(updatedUAndI.currency, " ").concat(depositAmount, " into ").concat(updatedUAndI.Savingsname, " ") },
                            { userId: updatedUAndI.partnerId, description: "".concat(req.user.firstName, " ").concat(req.user.lastName, " Deposited ").concat(updatedUAndI.currency, " ").concat(depositAmount, " into ").concat(updatedUAndI.Savingsname, " ") }
                        ]
                    })
                    // Return success response
                ];
            case 15:
                //create notification for both users
                _d.sent();
                // Return success response
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        code: 200,
                        message: "U And I account \"".concat(uAndISaving.Savingsname, "\" successfully funded from U-Wallet"),
                        data: {
                            uWalletBalance: updateUWallet.balance,
                            UAndIBalance: updatedUAndI.totalCapital
                        }
                    })];
            case 16:
                paymentInformation = {
                    user: user,
                    tx_ref: tx_ref,
                    amount: depositData.amount,
                    currency: "NGN", // Users can only deposit in NGN
                    product: "UANDI",
                    productId: depositData.id
                };
                return [4 /*yield*/, (0, requests_1.generatePaymentLink)(paymentInformation)];
            case 17:
                paymentLink = _d.sent();
                if (!paymentLink) return [3 /*break*/, 19];
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            amount: paymentInformation.amount,
                            transactionReference: tx_ref,
                            transactionCurrency: paymentInformation.currency,
                            description: "UANDI",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "DEPOSIT",
                            featureId: uAndISaving.id
                        }
                    })];
            case 18:
                newTransaction = _d.sent();
                console.log("_____________ ".concat(newTransaction.transactionReference, "___________"));
                if (!newTransaction) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Transaction could not be initialized", code: 500 })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: paymentLink })];
            case 19: return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Payment link could not be generated" })];
        }
    });
}); });
exports.depositIntoMyCabalSaving = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tx_ref, depositData, user, cabalGroup, userCabal, amount, uWallet, depositAmount_1, newUandITransaction, newUWalletWithdrawalTransaction, updateUWallet, upddatedUserCabal, allUsers, paymentInformation, paymentLink, newTransaction;
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
                return [4 /*yield*/, pris_client_1.default.cabalGroup.findFirst({
                        where: { id: depositData.id }
                    })];
            case 1:
                cabalGroup = _a.sent();
                if (!cabalGroup) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 404, error: "My Cabal Group savings account not found" })];
                }
                if (!cabalGroup.hasStarted) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Cabal Group has not started yet" })];
                }
                return [4 /*yield*/, pris_client_1.default.userCabal.findFirst({
                        where: {
                            cabalGroupId: cabalGroup.id,
                            userId: user.userId
                        }
                    })];
            case 2:
                userCabal = _a.sent();
                if (!userCabal) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "User not prsent in Cabal Group" })];
                }
                amount = depositData.amount;
                if (!(depositData.paymentMethod === "UWALLET")) return [3 /*break*/, 15];
                return [4 /*yield*/, pris_client_1.default.uWallet.findFirst({
                        where: {
                            userId: user.userId,
                            currency: "NGN" // user can only pay in NGN
                        }
                    })];
            case 3:
                uWallet = _a.sent();
                // Respond with error if no valid wallet
                if (!uWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No U-Wallet found", code: 400 })];
                }
                depositAmount_1 = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: uWallet.currency, to: cabalGroup.currency });
                // Respond with error if valid wallet has insufficient balance
                if (uWallet.balance < depositData.amount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Insufficient funds in U-Wallet", code: 400 })];
                }
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            transactionReference: tx_ref,
                            amount: depositData.amount,
                            transactionCurrency: uWallet.currency,
                            description: "CABAL",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "DEPOSIT",
                            featureId: userCabal.id
                        }
                    })
                    //create a withdrawal transaction in the wallet
                ];
            case 4:
                newUandITransaction = _a.sent();
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            transactionReference: tx_ref,
                            amount: depositData.amount,
                            transactionCurrency: uWallet.currency,
                            description: "UWALLET",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "WITHDRAWAL",
                            featureId: uWallet.id
                        }
                    })
                    // Remove actual value  from wallet
                ];
            case 5:
                newUWalletWithdrawalTransaction = _a.sent();
                return [4 /*yield*/, pris_client_1.default.uWallet.update({
                        where: { id: uWallet.id },
                        data: {
                            balance: { decrement: depositData.amount }
                        }
                    })];
            case 6:
                updateUWallet = _a.sent();
                if (!!updateUWallet) return [3 /*break*/, 9];
                // Update Transactions status to failed
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newUandITransaction.id, "FAIL")];
            case 7:
                // Update Transactions status to failed
                _a.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newUWalletWithdrawalTransaction.id, "FAIL")];
            case 8:
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 500, error: "Could not debit from U-Wallet" })];
            case 9: return [4 /*yield*/, pris_client_1.default.userCabal.update({
                    where: { id: userCabal.id },
                    data: {
                        totalBalance: { increment: depositAmount_1 },
                        cabalCapital: { increment: depositAmount_1 },
                    }
                })];
            case 10:
                upddatedUserCabal = _a.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newUWalletWithdrawalTransaction.id, "SUCCESS")];
            case 11:
                _a.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newUandITransaction.id, "SUCCESS")];
            case 12:
                _a.sent();
                return [4 /*yield*/, pris_client_1.default.userCabal.findMany({
                        where: { cabalGroupId: cabalGroup === null || cabalGroup === void 0 ? void 0 : cabalGroup.id }
                    })
                    //create a dashboard notifcation for all user in cabal
                ];
            case 13:
                allUsers = _a.sent();
                //create a dashboard notifcation for all user in cabal
                return [4 /*yield*/, pris_client_1.default.notification.createMany({
                        data: allUsers.map(function (item) {
                            var _a, _b;
                            return { userId: item.userId, description: "".concat((_a = req.user) === null || _a === void 0 ? void 0 : _a.firstName, " ").concat((_b = req.user) === null || _b === void 0 ? void 0 : _b.lastName, " Deposited ").concat(cabalGroup.currency, " ").concat(depositAmount_1, " into ").concat(cabalGroup.groupName) };
                        })
                    })
                    // Return success response
                ];
            case 14:
                //create a dashboard notifcation for all user in cabal
                _a.sent();
                // Return success response
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        code: 200,
                        message: "CABAL Group \"".concat(cabalGroup.groupName, "\" has been  successfully funded from U-Wallet"),
                        data: {
                            uWalletBalance: updateUWallet.balance,
                            userCabalBalamce: upddatedUserCabal.totalBalance
                        }
                    })];
            case 15:
                paymentInformation = {
                    user: user,
                    tx_ref: tx_ref,
                    amount: depositData.amount,
                    currency: "NGN", // Users can only deposit in NGN
                    product: "CABAL",
                    productId: depositData.id
                };
                return [4 /*yield*/, (0, requests_1.generatePaymentLink)(paymentInformation)];
            case 16:
                paymentLink = _a.sent();
                if (!paymentLink) return [3 /*break*/, 18];
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            amount: paymentInformation.amount,
                            transactionReference: tx_ref,
                            transactionCurrency: paymentInformation.currency,
                            description: "CABAL",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "DEPOSIT",
                            featureId: userCabal.id
                        }
                    })];
            case 17:
                newTransaction = _a.sent();
                console.log("_____________ ".concat(newTransaction.transactionReference, "___________"));
                if (!newTransaction) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Transaction could not be initialized", code: 500 })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: paymentLink })];
            case 18: return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Payment link could not be generated" })];
        }
    });
}); });
exports.depositIntoEmergencySavings = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tx_ref, depositData, user, emergencyAccount, amount, uWallet, depositAmount, newForUDepositTransaction, newUWalletWithdrawalTransaction, updateUWallet, updateEmergency, paymentInformation, paymentLink, newTransaction;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                tx_ref = (0, util_1.generateTransactionRef)();
                depositData = req.body;
                user = req.user;
                // Verify there is indeed a valid user
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.emergency.findFirst({
                        where: { id: depositData.id }
                    })];
            case 1:
                emergencyAccount = _b.sent();
                if (!emergencyAccount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 404, error: "ForU savings account not found" })];
                }
                //confirm user is allowed to make deposit
                if (emergencyAccount.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Not allowed to make this forUDeposit" })];
                }
                amount = depositData.amount;
                if (!(depositData.paymentMethod === "UWALLET")) return [3 /*break*/, 12];
                return [4 /*yield*/, pris_client_1.default.uWallet.findFirst({
                        where: {
                            userId: user.userId,
                            currency: "NGN" // user can only pay in NGN
                        }
                    })];
            case 2:
                uWallet = _b.sent();
                // Respond with error if no valid wallet
                if (!uWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No U-Wallet found", code: 400 })];
                }
                depositAmount = (0, transactions_util_1.getConvertedRate)({ amount: amount, from: uWallet.currency, to: emergencyAccount.currency });
                // Respond with error if valid wallet has insufficient balance
                if (uWallet.balance < depositData.amount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Insufficient funds in U-Wallet", code: 400 })];
                }
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            transactionReference: tx_ref,
                            amount: depositData.amount,
                            transactionCurrency: uWallet.currency,
                            description: "EMERGENCY",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "DEPOSIT",
                            featureId: emergencyAccount.id
                        }
                    })
                    //create a withdrawal transaction in the wallet
                ];
            case 3:
                newForUDepositTransaction = _b.sent();
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            transactionReference: tx_ref,
                            amount: depositData.amount,
                            transactionCurrency: uWallet.currency,
                            description: "UWALLET",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "WITHDRAWAL",
                            featureId: uWallet.id
                        }
                    })
                    // Remove from wallet
                ];
            case 4:
                newUWalletWithdrawalTransaction = _b.sent();
                return [4 /*yield*/, pris_client_1.default.uWallet.update({
                        where: { id: uWallet.id },
                        data: {
                            balance: { decrement: depositData.amount }
                        }
                    })];
            case 5:
                updateUWallet = _b.sent();
                if (!!updateUWallet) return [3 /*break*/, 8];
                // Update Transactions status to failed
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newUWalletWithdrawalTransaction.id, "FAIL")];
            case 6:
                // Update Transactions status to failed
                _b.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newForUDepositTransaction.id, "FAIL")];
            case 7:
                _b.sent();
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 500, error: "Could not debit from U-Wallet" })];
            case 8: return [4 /*yield*/, pris_client_1.default.emergency.update({
                    where: { id: emergencyAccount.id },
                    data: {
                        investmentCapital: { increment: depositAmount },
                        totalInvestment: { increment: depositAmount },
                        isActivated: true
                    }
                })];
            case 9:
                updateEmergency = _b.sent();
                // Update Generic Transactions status to successful
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newUWalletWithdrawalTransaction.id, "SUCCESS")];
            case 10:
                // Update Generic Transactions status to successful
                _b.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(newForUDepositTransaction.id, "SUCCESS")];
            case 11:
                _b.sent();
                // Return success response
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        code: 200,
                        message: "Emergency account \"".concat(emergencyAccount.savingsName, "\" successfully funded from U-Wallet"),
                        data: {
                            uWalletBalance: updateUWallet.balance,
                            forUBalance: updateEmergency.totalInvestment
                        }
                    })];
            case 12:
                paymentInformation = {
                    user: user,
                    tx_ref: tx_ref,
                    amount: depositData.amount,
                    currency: "NGN", // Users can only deposit in NGN
                    product: "EMERGENCY",
                    productId: depositData.id
                };
                return [4 /*yield*/, (0, requests_1.generatePaymentLink)(paymentInformation)];
            case 13:
                paymentLink = _b.sent();
                if (!paymentLink) return [3 /*break*/, 15];
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            amount: paymentInformation.amount,
                            transactionReference: tx_ref,
                            transactionCurrency: paymentInformation.currency,
                            description: "EMERGENCY",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "DEPOSIT",
                            featureId: emergencyAccount.id
                        }
                    })];
            case 14:
                newTransaction = _b.sent();
                console.log("_______EMERGENCY______ ".concat(newTransaction.transactionReference, "___________"));
                if (!newTransaction) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Transaction could not be initialized", code: 500 })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: paymentLink })];
            case 15: return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Payment link could not be generated, Try Again" })];
        }
    });
}); });
