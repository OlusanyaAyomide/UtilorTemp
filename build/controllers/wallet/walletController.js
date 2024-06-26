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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositIntoUWalletViaFlutterwave = exports.depositIntoUWallet = exports.getWalletInfo = void 0;
var catch_async_1 = __importDefault(require("../../utils/catch-async"));
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var util_1 = require("../../utils/util");
var requests_1 = require("../../config/requests");
var transactions_util_1 = require("../../utils/transactions.util");
//tempoary balance view, will be extended later
exports.getWalletInfo = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, wallet, transactions;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                return [4 /*yield*/, pris_client_1.default.uWallet.findFirst({
                        where: { userId: userId }
                    })];
            case 1:
                wallet = _b.sent();
                if (!wallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Wallet not found" })];
                }
                return [4 /*yield*/, pris_client_1.default.transaction.findMany({
                        where: { featureId: wallet.id },
                        orderBy: {
                            createdAt: "desc"
                        }
                    })];
            case 2:
                transactions = _b.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: __assign(__assign({}, wallet), { transactions: transactions }) })];
        }
    });
}); });
//deposits into u walet
exports.depositIntoUWallet = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var depositData, tx_ref, user, uWallet, paymentInformation, paymentLink, newTransaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                depositData = req.body;
                tx_ref = (0, util_1.generateTransactionRef)();
                user = req.user;
                return [4 /*yield*/, pris_client_1.default.uWallet.findFirst({
                        where: { id: depositData.id }
                    })];
            case 1:
                uWallet = _a.sent();
                if (!uWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: "Specified U-Wallet not found" })];
                }
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 500, error: "Something went wrong" })];
                }
                console.log("\n        ------------".concat(tx_ref, "---------------\n    "));
                paymentInformation = {
                    user: user,
                    tx_ref: tx_ref,
                    amount: depositData.amount,
                    //? Might remove or add this later, currency: "NGN", // Users can only deposit in NGN
                    currency: depositData.currency,
                    product: "FORU",
                    productId: uWallet.id
                };
                return [4 /*yield*/, (0, requests_1.generatePaymentLink)(paymentInformation)];
            case 2:
                paymentLink = _a.sent();
                if (!paymentLink) return [3 /*break*/, 4];
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: user.userId,
                            amount: paymentInformation.amount,
                            transactionReference: tx_ref,
                            transactionCurrency: paymentInformation.currency,
                            description: "UWALLET",
                            paymentMethod: depositData.paymentMethod,
                            transactionType: "DEPOSIT",
                            featureId: uWallet.id
                        }
                    })];
            case 3:
                newTransaction = _a.sent();
                if (!newTransaction) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Transaction could not be initialized", code: 500 })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: paymentLink })];
            case 4: return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Payment link could not be generated" })];
        }
    });
}); });
//u wallet handler should be created later
var depositIntoUWalletViaFlutterwave = function (dataFromWebhook, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var status, uWallet, depositAmount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                status = dataFromWebhook.status;
                if (transaction.transactionStatus !== "PENDING") {
                    throw new Error("Transaction status has already been modified");
                }
                if (!(status !== "successful")) return [3 /*break*/, 2];
                // If failed, update and return
                return [4 /*yield*/, pris_client_1.default.transaction.update({
                        where: { id: transaction.id },
                        data: {
                            transactionStatus: "FAIL"
                        }
                    })];
            case 1:
                // If failed, update and return
                _a.sent();
                throw new Error("Flutterwave transaction unsuccessful");
            case 2: 
            //* Transaction status successful and not modified. We can safely deposit the money
            // Update USaveForUTransaction to be successful
            return [4 /*yield*/, pris_client_1.default.transaction.update({
                    where: {
                        id: transaction.id
                    },
                    data: {
                        transactionStatus: "SUCCESS"
                    }
                })
                // Modify the UWallet as needed
            ];
            case 3:
                //* Transaction status successful and not modified. We can safely deposit the money
                // Update USaveForUTransaction to be successful
                _a.sent();
                return [4 /*yield*/, pris_client_1.default.uWallet.findFirst({
                        where: { id: transaction.featureId }
                    })];
            case 4:
                uWallet = _a.sent();
                if (!uWallet) {
                    throw new Error("U-Wallet not found");
                }
                depositAmount = (0, transactions_util_1.getConvertedRate)({ amount: transaction.amount, from: transaction.transactionCurrency, to: uWallet.currency });
                return [4 /*yield*/, pris_client_1.default.uWallet.update({
                        where: { id: transaction.featureId },
                        data: {
                            balance: { increment: depositAmount },
                        }
                    })];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, transactions_util_1.updateTransactionStatus)(transaction.id, "SUCCESS")];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.depositIntoUWalletViaFlutterwave = depositIntoUWalletViaFlutterwave;
