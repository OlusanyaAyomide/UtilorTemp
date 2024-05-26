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
exports.getSavingsList = exports.getAllSavingsData = exports.getSingleEmergency = exports.getAllUserEmergency = exports.getAllCabalUsers = exports.getAllUserUAndI = exports.getSingleForU = exports.getAllUserForU = void 0;
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
var catch_async_1 = __importDefault(require("../../utils/catch-async"));
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var util_1 = require("../../utils/util");
exports.getAllUserForU = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, allForU, transformedForU;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.uSaveForU.findMany({
                        where: { userId: userId },
                        include: {
                            promoCode: {
                                select: {
                                    promoCode: {
                                        select: {
                                            name: true,
                                            percentageIncrease: true,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 1:
                allForU = _b.sent();
                transformedForU = allForU.map(function (forU) { return (__assign(__assign({}, forU), { promoCode: forU.promoCode.map(function (pc) { return pc.promoCode; }) })); });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: transformedForU })];
        }
    });
}); });
exports.getSingleForU = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var detail, singleForU, transformedForU, transactions, data;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                detail = req.params.id;
                if (!detail) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Id is required" })];
                }
                return [4 /*yield*/, pris_client_1.default.uSaveForU.findFirst({
                        where: { id: detail },
                        include: {
                            promoCode: {
                                select: {
                                    promoCode: {
                                        select: {
                                            name: true,
                                            percentageIncrease: true,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 1:
                singleForU = _b.sent();
                if (!singleForU) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "For U Id is invalid" })];
                }
                if (singleForU.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Not permitted to view this savings" })];
                }
                transformedForU = __assign(__assign({}, singleForU), { promoCode: singleForU.promoCode.map(function (pc) { return pc.promoCode; }) });
                return [4 /*yield*/, pris_client_1.default.transaction.findMany({
                        where: {
                            featureId: singleForU.id
                        }
                    })];
            case 2:
                transactions = _b.sent();
                data = __assign(__assign({}, transformedForU), { transactions: transactions });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: data })];
        }
    });
}); });
//get all UandI where the user is either the creator or the partner
exports.getAllUserUAndI = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, allUAndI, transformedUAndI;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.uANDI.findMany({
                        where: {
                            OR: [
                                {
                                    creatorId: userId
                                },
                                {
                                    partnerId: userId
                                }
                            ]
                        },
                        orderBy: {
                            totalCapital: "desc"
                        },
                        include: {
                            promoCode: {
                                select: {
                                    promoCode: {
                                        select: {
                                            name: true,
                                            percentageIncrease: true,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 1:
                allUAndI = _b.sent();
                transformedUAndI = allUAndI.map(function (uAndI) { return (__assign(__assign({}, uAndI), { promoCode: uAndI.promoCode.map(function (pc) { return pc.promoCode; }) })); });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: transformedUAndI })];
        }
    });
}); });
//returns all user in a cabal
exports.getAllCabalUsers = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, cabalId, isAMember, allUsers;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                cabalId = req.params.id;
                if (!cabalId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Cabal Id is required", code: 500 })];
                }
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.userCabal.findFirst({
                        where: {
                            cabalGroupId: cabalId,
                            userId: userId
                        }
                    })
                    //only allow members to read cabal data
                ];
            case 1:
                isAMember = _b.sent();
                //only allow members to read cabal data
                if (!isAMember) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Unauthorized to view this information" })];
                }
                return [4 /*yield*/, pris_client_1.default.cabalGroup.findFirst({ where: { id: cabalId },
                        include: {
                            userCabals: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            email: true,
                                            lastName: true,
                                        }
                                    }
                                },
                                orderBy: {
                                    totalBalance: "desc"
                                }
                            }
                        }
                    })];
            case 2:
                allUsers = _b.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: allUsers })];
        }
    });
}); });
exports.getAllUserEmergency = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, allEmergency, transformedEmergency;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.emergency.findMany({
                        where: { userId: userId },
                        include: {
                            promoCode: {
                                select: {
                                    promoCode: {
                                        select: {
                                            name: true,
                                            percentageIncrease: true,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 1:
                allEmergency = _b.sent();
                transformedEmergency = allEmergency.map(function (emergency) { return (__assign(__assign({}, emergency), { promoCode: emergency.promoCode.map(function (pc) { return pc.promoCode; }) })); });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: transformedEmergency })];
        }
    });
}); });
exports.getSingleEmergency = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var detail, singleEmergency, transactions, transformedEmergency, data;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                detail = req.params.id;
                if (!detail) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Id is required" })];
                }
                return [4 /*yield*/, pris_client_1.default.emergency.findFirst({
                        where: { id: detail },
                        include: {
                            promoCode: {
                                select: {
                                    promoCode: {
                                        select: {
                                            name: true,
                                            percentageIncrease: true,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 1:
                singleEmergency = _b.sent();
                if (!singleEmergency) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Emergency Id is invalid" })];
                }
                if (singleEmergency.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Not permitted to view this savings" })];
                }
                return [4 /*yield*/, pris_client_1.default.transaction.findMany({
                        where: {
                            featureId: singleEmergency.id
                        }
                    })];
            case 2:
                transactions = _b.sent();
                transformedEmergency = __assign(__assign({}, singleEmergency), { promoCode: singleEmergency.promoCode.map(function (pc) { return pc.promoCode; }) });
                data = __assign(__assign({}, transformedEmergency), { transactions: transactions });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: data })];
        }
    });
}); });
exports.getAllSavingsData = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, totalForUNairaBalance, totalForUDollarbalaance, allForus, totalEmergencyNairaBalance, totalEmergencyDollarBalance, allEmergency, totalUAndINairaBalance, totalUAndIDollarBalance, allUandI, totalUserNairaCabal, totalUserDollarCabal, allUserCabal, savingsSummary;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                totalForUNairaBalance = 0;
                totalForUDollarbalaance = 0;
                return [4 /*yield*/, pris_client_1.default.uSaveForU.findMany({
                        where: { userId: userId }
                    })];
            case 1:
                allForus = _b.sent();
                allForus.forEach(function (foru) {
                    if (foru.currency === "NGN") {
                        totalForUNairaBalance += foru.totalInvestment;
                    }
                    else {
                        totalForUDollarbalaance += foru.totalInvestment;
                    }
                });
                totalEmergencyNairaBalance = 0;
                totalEmergencyDollarBalance = 0;
                return [4 /*yield*/, pris_client_1.default.emergency.findMany({
                        where: { userId: userId }
                    })];
            case 2:
                allEmergency = _b.sent();
                allEmergency.forEach(function (emergency) {
                    if (emergency.currency === "NGN") {
                        totalEmergencyNairaBalance += emergency.totalInvestment;
                    }
                    else {
                        totalEmergencyDollarBalance += emergency.totalInvestment;
                    }
                });
                totalUAndINairaBalance = 0;
                totalUAndIDollarBalance = 0;
                return [4 /*yield*/, pris_client_1.default.uANDI.findMany({
                        where: { OR: [
                                { creatorId: userId },
                                { partnerId: userId }
                            ] }
                    })];
            case 3:
                allUandI = _b.sent();
                allUandI.forEach(function (uandI) {
                    if (uandI.currency === "NGN") {
                        if (uandI.creatorId === userId) {
                            totalUAndINairaBalance += (uandI.creatorCapital + uandI.creatorInvestmentReturn);
                        }
                        else {
                            totalUAndINairaBalance += (uandI.partnerCapital + uandI.partnerInvestmentReturn);
                        }
                    }
                    else {
                        if (uandI.creatorId === userId) {
                            totalUAndIDollarBalance += (uandI.creatorCapital + uandI.creatorInvestmentReturn);
                        }
                        else {
                            totalUAndIDollarBalance += (uandI.partnerCapital + uandI.partnerInvestmentReturn);
                        }
                    }
                });
                totalUserNairaCabal = 0;
                totalUserDollarCabal = 0;
                return [4 /*yield*/, pris_client_1.default.userCabal.findMany({
                        where: { userId: userId },
                        include: {
                            cabelGroup: true
                        }
                    })];
            case 4:
                allUserCabal = _b.sent();
                allUserCabal.forEach(function (cabal) {
                    if (cabal.cabelGroup.currency === "NGN") {
                        totalUserNairaCabal += cabal.totalBalance;
                    }
                    else {
                        totalUserDollarCabal += cabal.totalBalance;
                    }
                });
                savingsSummary = {
                    forU: {
                        NGN: totalForUNairaBalance,
                        USD: totalForUDollarbalaance
                    },
                    uAndI: {
                        NGN: totalUAndINairaBalance,
                        USD: totalUAndIDollarBalance
                    },
                    emergency: {
                        NGN: totalEmergencyNairaBalance,
                        USD: totalEmergencyDollarBalance
                    },
                    cabals: {
                        NGN: totalUserNairaCabal,
                        USD: totalUserDollarCabal,
                    },
                    total: {
                        NGN: totalForUNairaBalance + totalUAndINairaBalance + totalEmergencyNairaBalance + totalUserNairaCabal,
                        USD: totalForUDollarbalaance + totalUAndIDollarBalance + totalEmergencyDollarBalance + totalUserDollarCabal
                    }
                };
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: savingsSummary })];
        }
    });
}); });
exports.getSavingsList = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, forU, emergency, uandI, cabal, savingsArray;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.uSaveForU.findMany({
                        where: {
                            userId: userId
                        }
                    })];
            case 1:
                forU = _b.sent();
                return [4 /*yield*/, pris_client_1.default.emergency.findMany({
                        where: {
                            userId: userId
                        }
                    })];
            case 2:
                emergency = _b.sent();
                return [4 /*yield*/, pris_client_1.default.uANDI.findMany({
                        where: {
                            OR: [
                                {
                                    creatorId: userId
                                },
                                {
                                    partnerId: userId
                                }
                            ]
                        }
                    })];
            case 3:
                uandI = _b.sent();
                return [4 /*yield*/, pris_client_1.default.userCabal.findMany({
                        where: {
                            userId: userId
                        },
                        include: {
                            cabelGroup: true
                        }
                    })];
            case 4:
                cabal = _b.sent();
                savingsArray = [];
                forU.forEach(function (saving) {
                    var item = {
                        savingsName: saving.savingsName,
                        savingsId: saving.id,
                        savingsType: "FORU",
                        startDate: saving.createdAt,
                        endDate: saving.endingDate,
                        percentageCompleted: (0, util_1.calculateSavingsPercentage)({ initial: saving.expectedMonthlyAmount, currentTotal: saving.totalInvestment, startDate: saving.createdAt, endDate: saving.endingDate }),
                        monthlySaving: saving.expectedMonthlyAmount,
                        currency: saving.currency,
                        totalInvestment: saving.totalInvestment,
                        iconLink: saving.iconLink
                    };
                    savingsArray.push(item);
                });
                emergency.forEach(function (saving) {
                    var item = {
                        savingsName: saving.savingsName,
                        savingsId: saving.id,
                        savingsType: "EMERGENCY",
                        startDate: saving.createdAt,
                        endDate: saving.endingDate,
                        percentageCompleted: (0, util_1.calculateSavingsPercentage)({ initial: saving.expectedMonthlyAmount, currentTotal: saving.totalInvestment, startDate: saving.createdAt, endDate: saving.endingDate }),
                        monthlySaving: saving.expectedMonthlyAmount,
                        currency: saving.currency,
                        totalInvestment: saving.totalInvestment,
                        iconLink: saving.iconLink
                    };
                    savingsArray.push(item);
                });
                uandI.forEach(function (saving) {
                    var totalUandI = saving.partnerCapital + saving.totalCapital + saving.totalInvestmentReturn;
                    var item = {
                        savingsName: saving.Savingsname,
                        savingsId: saving.id,
                        savingsType: "UANDI",
                        startDate: saving.createdAt,
                        endDate: saving.endingDate,
                        percentageCompleted: (0, util_1.calculateSavingsPercentage)({
                            initial: saving.expectedMonthlyAmount, currentTotal: totalUandI, startDate: saving.createdAt, endDate: saving.endingDate
                        }),
                        currency: saving.currency,
                        monthlySaving: saving.expectedMonthlyAmount,
                        totalInvestment: totalUandI,
                        iconLink: saving.iconLink
                    };
                    savingsArray.push(item);
                });
                cabal.forEach(function (userCabal) {
                    var cabalGroup = userCabal.cabelGroup;
                    var item = {
                        savingsName: cabalGroup.groupName,
                        savingsId: cabalGroup.id,
                        savingsType: "CABAL",
                        startDate: cabalGroup.createdAt,
                        endDate: cabalGroup.lockedInDate,
                        percentageCompleted: null,
                        currency: cabalGroup.currency,
                        totalInvestment: userCabal.totalBalance,
                        monthlySaving: null,
                        iconLink: cabalGroup.iconLink
                    };
                    savingsArray.push(item);
                });
                savingsArray.sort(function (a, b) {
                    var totalInvestmentA = a.currency === "USD" ? a.totalInvestment * (0, util_1.getCurrentDollarRate)() : a.totalInvestment;
                    var totalInvestmentB = b.currency === "USD" ? b.totalInvestment * (0, util_1.getCurrentDollarRate)() : b.totalInvestment;
                    return totalInvestmentB - totalInvestmentA; // 
                });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        data: savingsArray
                    })];
        }
    });
}); });
