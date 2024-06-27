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
exports.depositIntoUVestViaFlutterwave = void 0;
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var transactions_util_1 = require("../../utils/transactions.util");
var util_1 = require("../../utils/util");
var depositIntoUVestViaFlutterwave = function (dataFromWebhook, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var status, userPortfolio, mutualFund, depositAmount;
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
            case 2: return [4 /*yield*/, pris_client_1.default.userMutualFund.findFirst({
                    where: { id: transaction.featureId },
                    include: {
                        mutualFund: true
                    }
                })];
            case 3:
                userPortfolio = _a.sent();
                if (!userPortfolio) {
                    throw new Error("product could not be found");
                }
                mutualFund = userPortfolio.mutualFund;
                depositAmount = (0, transactions_util_1.getConvertedRate)({
                    from: transaction.transactionCurrency,
                    to: mutualFund.currency,
                    amount: transaction.amount
                });
                console.log(depositAmount);
                //update balance with actual account        
                return [4 /*yield*/, pris_client_1.default.userMutualFund.update({
                        where: { id: userPortfolio.id },
                        data: {
                            capital: { increment: depositAmount },
                            activeBalance: { increment: depositAmount },
                            visibleBalance: { increment: depositAmount },
                            isActive: true
                        }
                    })];
            case 4:
                //update balance with actual account        
                _a.sent();
                return [4 /*yield*/, pris_client_1.default.transaction.create({
                        data: {
                            userId: transaction.userId,
                            transactionReference: (0, util_1.generateTransactionRef)(),
                            amount: depositAmount,
                            transactionCurrency: mutualFund.currency,
                            description: "UVEST",
                            paymentMethod: transaction.paymentMethod,
                            transactionType: "DEPOSIT",
                            featureId: userPortfolio.id
                        }
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.depositIntoUVestViaFlutterwave = depositIntoUVestViaFlutterwave;
