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
exports.depositIntoEmeergencySavingViaFlutterwave = exports.depositIntoMyCabalSavingViaFlutterwave = exports.depositIntoUAndISavingViaFlutterwave = exports.depositIntoForUSavingViaFlutterwave = void 0;
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var transactions_util_1 = require("../../utils/transactions.util");
var depositIntoForUSavingViaFlutterwave = function (dataFromWebhook, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var status, uSaveForUAccount, depositAmount;
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
                // Modify the USaveForUAccount as needed
            ];
            case 3:
                //* Transaction status successful and not modified. We can safely deposit the money
                // Update USaveForUTransaction to be successful
                _a.sent();
                return [4 /*yield*/, pris_client_1.default.uSaveForU.findFirst({
                        where: { id: transaction.featureId }
                    })];
            case 4:
                uSaveForUAccount = _a.sent();
                if (!uSaveForUAccount) {
                    throw new Error("For-U account not found");
                }
                depositAmount = (0, transactions_util_1.getConvertedRate)({ amount: transaction.amount, from: dataFromWebhook.currency, to: uSaveForUAccount.currency });
                // let convertedAmount = 0;
                return [4 /*yield*/, pris_client_1.default.uSaveForU.update({
                        where: { id: transaction.featureId },
                        data: {
                            investmentCapital: { increment: depositAmount },
                            totalInvestment: { increment: depositAmount },
                            isActivated: true
                        }
                    })];
            case 5:
                // let convertedAmount = 0;
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.depositIntoForUSavingViaFlutterwave = depositIntoForUSavingViaFlutterwave;
var depositIntoUAndISavingViaFlutterwave = function (dataFromWebhook, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var status, uAndISaving, depositAmount, isCreator, depositUserInfo;
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
                // Modify the CABAL ACCOUNT as needed
            ];
            case 3:
                //* Transaction status successful and not modified. We can safely deposit the money
                // Update USaveForUTransaction to be successful
                _a.sent();
                return [4 /*yield*/, pris_client_1.default.uANDI.findFirst({
                        where: { id: transaction.featureId }
                    })];
            case 4:
                uAndISaving = _a.sent();
                if (!uAndISaving) {
                    throw new Error("For-U account not found");
                }
                depositAmount = (0, transactions_util_1.getConvertedRate)({ amount: transaction.amount, from: transaction.transactionCurrency, to: uAndISaving.currency });
                isCreator = transaction.userId === uAndISaving.creatorId;
                if (!isCreator) return [3 /*break*/, 6];
                return [4 /*yield*/, pris_client_1.default.uANDI.update({
                        where: { id: uAndISaving.id },
                        data: {
                            creatorCapital: { increment: depositAmount },
                            totalInvestmentFund: { increment: depositAmount },
                            isActivated: true
                        }
                    })];
            case 5:
                _a.sent();
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, pris_client_1.default.uANDI.update({
                    where: { id: uAndISaving.id },
                    data: {
                        partnerCapital: { increment: depositAmount },
                        totalInvestmentFund: { increment: depositAmount },
                        isActivated: true
                    }
                })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [4 /*yield*/, pris_client_1.default.user.findFirst({ where: { id: transaction.userId } })];
            case 9:
                depositUserInfo = _a.sent();
                return [4 /*yield*/, pris_client_1.default.notification.createMany({
                        data: [
                            { userId: uAndISaving.creatorId, description: "".concat(depositUserInfo === null || depositUserInfo === void 0 ? void 0 : depositUserInfo.firstName, " ").concat(depositUserInfo === null || depositUserInfo === void 0 ? void 0 : depositUserInfo.lastName, " Deposited ").concat(uAndISaving.currency, " ").concat(depositAmount, " into ").concat(uAndISaving.Savingsname) },
                            { userId: uAndISaving.partnerId, description: "".concat(depositUserInfo === null || depositUserInfo === void 0 ? void 0 : depositUserInfo.firstName, " ").concat(depositUserInfo === null || depositUserInfo === void 0 ? void 0 : depositUserInfo.lastName, " Deposited ").concat(uAndISaving.currency, " ").concat(depositAmount, " into ").concat(uAndISaving.Savingsname) }
                        ]
                    })];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.depositIntoUAndISavingViaFlutterwave = depositIntoUAndISavingViaFlutterwave;
var depositIntoMyCabalSavingViaFlutterwave = function (dataFromWebhook, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var status, userCabal_1, depositAmount_1, allUsers;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
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
                _b.sent();
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
                // Modify the USaveForUAccount as needed
            ];
            case 3:
                //* Transaction status successful and not modified. We can safely deposit the money
                // Update USaveForUTransaction to be successful
                _b.sent();
                return [4 /*yield*/, pris_client_1.default.userCabal.findFirst({
                        where: { id: transaction.featureId },
                        include: {
                            cabelGroup: true,
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    })];
            case 4:
                userCabal_1 = _b.sent();
                if (!userCabal_1) {
                    throw new Error("Cabal Account not found");
                }
                depositAmount_1 = (0, transactions_util_1.getConvertedRate)({ amount: transaction.amount, from: dataFromWebhook.currency, to: userCabal_1.cabelGroup.currency });
                return [4 /*yield*/, pris_client_1.default.userCabal.update({
                        where: { id: transaction.featureId },
                        data: {
                            cabalCapital: { increment: depositAmount_1 },
                            totalBalance: { increment: depositAmount_1 },
                        }
                    })
                    //create notifications for all cabal users
                ];
            case 5:
                _b.sent();
                return [4 /*yield*/, pris_client_1.default.userCabal.findMany({
                        where: { cabalGroupId: (_a = userCabal_1.cabelGroup) === null || _a === void 0 ? void 0 : _a.id }
                    })
                    //create a dashboard notifcation for all user in cabal
                ];
            case 6:
                allUsers = _b.sent();
                //create a dashboard notifcation for all user in cabal
                return [4 /*yield*/, pris_client_1.default.notification.createMany({
                        data: allUsers.map(function (item) {
                            return { userId: item.userId, description: "".concat(userCabal_1.user.firstName, " ").concat(userCabal_1.user.lastName, " Deposited ").concat(userCabal_1.cabelGroup.currency, " ").concat(depositAmount_1, " into ").concat(userCabal_1.cabelGroup.groupName) };
                        })
                    })];
            case 7:
                //create a dashboard notifcation for all user in cabal
                _b.sent();
                _b.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.depositIntoMyCabalSavingViaFlutterwave = depositIntoMyCabalSavingViaFlutterwave;
var depositIntoEmeergencySavingViaFlutterwave = function (dataFromWebhook, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var status, emergecyAccount, depositAmount;
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
                // Modify the EmergencyAccount as needed
            ];
            case 3:
                //* Transaction status successful and not modified. We can safely deposit the money
                // Update USaveForUTransaction to be successful
                _a.sent();
                return [4 /*yield*/, pris_client_1.default.emergency.findFirst({
                        where: { id: transaction.featureId }
                    })];
            case 4:
                emergecyAccount = _a.sent();
                if (!emergecyAccount) {
                    throw new Error("For-U account not found");
                }
                depositAmount = (0, transactions_util_1.getConvertedRate)({ amount: transaction.amount, from: dataFromWebhook.currency, to: emergecyAccount.currency });
                // let convertedAmount = 0;
                return [4 /*yield*/, pris_client_1.default.emergency.update({
                        where: { id: transaction.featureId },
                        data: {
                            investmentCapital: { increment: depositAmount },
                            totalInvestment: { increment: depositAmount },
                            isActivated: true
                        }
                    })];
            case 5:
                // let convertedAmount = 0;
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.depositIntoEmeergencySavingViaFlutterwave = depositIntoEmeergencySavingViaFlutterwave;
