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
exports.updateWallets = void 0;
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var util_1 = require("../../utils/util");
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
function updateWallets(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var cronTracker, allForU, forUpercentage_1, operations, allEmergency, emergencypercentage_1, emergencyOperations, allUandIs, uandIPercentage_1, uandioperations, allCabals, allCabalOperations, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pris_client_1.default.cronTracker.create({
                        data: {
                            type: "WALLET_UPDATE",
                        }
                    })];
                case 1:
                    cronTracker = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 12, , 14]);
                    return [4 /*yield*/, pris_client_1.default.uSaveForU.findMany({
                            where: { isActivated: true },
                            include: {
                                promoCode: true
                            }
                        })];
                case 3:
                    allForU = _a.sent();
                    forUpercentage_1 = (0, util_1.getForUPercentage)();
                    operations = allForU.flatMap(function (forUWallet) {
                        //add promocode percentage to user
                        var intrestPercentage = forUpercentage_1;
                        forUWallet.promoCode.forEach(function (code) {
                            intrestPercentage += code.percentageIncrease;
                        });
                        console.log(intrestPercentage);
                        //update wallet with new percentage
                        var newReturns = (0, util_1.calculateDailyReturns)({ capital: forUWallet.investmentCapital, interest: intrestPercentage });
                        var newTotalReturns = forUWallet.totalInvestment + newReturns;
                        return [
                            pris_client_1.default.uSaveForU.update({ where: { id: forUWallet.id },
                                data: {
                                    returnOfInvestment: newReturns,
                                    totalInvestment: newTotalReturns
                                }
                            }),
                            pris_client_1.default.transaction.create({
                                data: {
                                    transactionReference: (0, util_1.generateTransactionRef)(),
                                    transactionCurrency: forUWallet.currency,
                                    amount: newReturns,
                                    description: "FORU",
                                    featureId: forUWallet.id,
                                    userId: forUWallet.userId,
                                    transactionStatus: "SUCCESS",
                                    transactionType: "INTEREST",
                                    paymentMethod: "UWALLET",
                                    note: "".concat(intrestPercentage, "% incerease")
                                }
                            })
                        ];
                    });
                    //update all emergency wallets simulataneously
                    return [4 /*yield*/, pris_client_1.default.$transaction(operations)];
                case 4:
                    //update all emergency wallets simulataneously
                    _a.sent();
                    return [4 /*yield*/, pris_client_1.default.emergency.findMany({
                            where: { isActivated: true },
                            include: {
                                promoCode: true
                            }
                        })];
                case 5:
                    allEmergency = _a.sent();
                    emergencypercentage_1 = (0, util_1.getEmergencypercentage)();
                    emergencyOperations = allEmergency.flatMap(function (emergencyWallet) {
                        //add promocode percentage to user
                        var intrestPercentage = emergencypercentage_1;
                        emergencyWallet.promoCode.forEach(function (code) {
                            intrestPercentage += code.percentageIncrease;
                        });
                        console.log(intrestPercentage, "EMERGENCY");
                        //update wallet with new percentage
                        var newReturns = (0, util_1.calculateDailyReturns)({ capital: emergencyWallet.investmentCapital, interest: intrestPercentage });
                        var newTotalReturns = emergencyWallet.totalInvestment + newReturns;
                        return [
                            pris_client_1.default.emergency.update({ where: { id: emergencyWallet.id },
                                data: {
                                    returnOfInvestment: newReturns,
                                    totalInvestment: newTotalReturns
                                }
                            }),
                            pris_client_1.default.transaction.create({
                                data: {
                                    transactionReference: (0, util_1.generateTransactionRef)(),
                                    transactionCurrency: emergencyWallet.currency,
                                    amount: newReturns,
                                    description: "EMERGENCY",
                                    featureId: emergencyWallet.id,
                                    userId: emergencyWallet.userId,
                                    transactionStatus: "SUCCESS",
                                    transactionType: "INTEREST",
                                    paymentMethod: "UWALLET",
                                    note: "".concat(intrestPercentage, "% incerease")
                                }
                            })
                        ];
                    });
                    //update all wallets simulataneously
                    return [4 /*yield*/, pris_client_1.default.$transaction(emergencyOperations)];
                case 6:
                    //update all wallets simulataneously
                    _a.sent();
                    return [4 /*yield*/, pris_client_1.default.uANDI.findMany({
                            where: { isActivated: true },
                            include: {
                                promoCode: true
                            }
                        })];
                case 7:
                    allUandIs = _a.sent();
                    uandIPercentage_1 = (0, util_1.getUAndIPercentage)();
                    uandioperations = allUandIs.flatMap(function (uandIWallet) {
                        //add promocode percentage to user
                        var intrestPercentage = uandIPercentage_1;
                        uandIWallet.promoCode.forEach(function (code) {
                            intrestPercentage += code.percentageIncrease;
                        });
                        console.log(intrestPercentage, "UANDI");
                        //update Uand I wallet with new percentage
                        var newCreatorReturns = (0, util_1.calculateDailyReturns)({ capital: uandIWallet.creatorCapital, interest: intrestPercentage });
                        var newpartnerReturns = (0, util_1.calculateDailyReturns)({ capital: uandIWallet.partnerCapital, interest: intrestPercentage });
                        var newTotalCapital = uandIWallet.totalCapital + newCreatorReturns + newpartnerReturns;
                        var newInvestmentOfReturn = uandIWallet.totalInvestmentReturn + newCreatorReturns + newpartnerReturns;
                        return [
                            pris_client_1.default.uANDI.update({ where: { id: uandIWallet.id },
                                data: {
                                    creatorInvestmentReturn: newCreatorReturns + uandIWallet.creatorInvestmentReturn,
                                    partnerInvestmentReturn: newpartnerReturns + uandIWallet.partnerInvestmentReturn,
                                    totalInvestmentReturn: newInvestmentOfReturn,
                                    totalCapital: newTotalCapital
                                }
                            }),
                            //create two transactions for creator and partner
                            pris_client_1.default.transaction.create({
                                data: {
                                    transactionReference: (0, util_1.generateTransactionRef)(),
                                    transactionCurrency: uandIWallet.currency,
                                    amount: newCreatorReturns + newpartnerReturns,
                                    description: "UANDI",
                                    featureId: uandIWallet.id,
                                    userId: uandIWallet.creatorId,
                                    transactionStatus: "SUCCESS",
                                    transactionType: "INTEREST",
                                    paymentMethod: "UWALLET",
                                    note: "".concat(intrestPercentage, "% incerease")
                                }
                            }),
                            pris_client_1.default.transaction.create({
                                data: {
                                    transactionReference: (0, util_1.generateTransactionRef)(),
                                    transactionCurrency: uandIWallet.currency,
                                    amount: newCreatorReturns + newpartnerReturns,
                                    description: "UANDI",
                                    featureId: uandIWallet.id,
                                    userId: uandIWallet.partnerId,
                                    transactionStatus: "SUCCESS",
                                    transactionType: "INTEREST",
                                    paymentMethod: "UWALLET",
                                    note: "".concat(intrestPercentage, "% incerease")
                                }
                            })
                        ];
                    });
                    //update all emergency wallets simulataneously
                    return [4 /*yield*/, pris_client_1.default.$transaction(uandioperations)
                        //add to all userCabal
                    ];
                case 8:
                    //update all emergency wallets simulataneously
                    _a.sent();
                    return [4 /*yield*/, pris_client_1.default.cabalGroup.findMany({
                            where: {
                                hasStarted: true,
                            },
                            include: {
                                userCabals: true
                            }
                        })];
                case 9:
                    allCabals = _a.sent();
                    allCabalOperations = allCabals.flatMap(function (cabalGroup) {
                        var interestPercentage = (0, util_1.getCabalpercentage)();
                        var cabalGroupusers = cabalGroup.userCabals.flatMap(function (userCabal) {
                            var dailyInterest = (0, util_1.calculateDailyReturns)({ capital: userCabal.cabalCapital, interest: interestPercentage });
                            var userCabalTotalInterest = userCabal.cabalRoI + dailyInterest;
                            var userCabalTotal = userCabal.totalBalance + dailyInterest;
                            return [
                                pris_client_1.default.userCabal.update({
                                    where: { id: userCabal.id },
                                    data: {
                                        totalBalance: userCabalTotal,
                                        cabalRoI: userCabalTotalInterest
                                    }
                                }),
                                //create new resulting transaction
                                pris_client_1.default.transaction.create({
                                    data: {
                                        transactionReference: (0, util_1.generateTransactionRef)(),
                                        transactionCurrency: cabalGroup.currency,
                                        amount: dailyInterest,
                                        description: "CABAL",
                                        featureId: userCabal.id,
                                        userId: userCabal.userId,
                                        transactionStatus: "SUCCESS",
                                        transactionType: "INTEREST",
                                        paymentMethod: "UWALLET",
                                        note: "".concat(interestPercentage, "% incerease")
                                    }
                                })
                            ];
                        });
                        return cabalGroupusers;
                    });
                    return [4 /*yield*/, pris_client_1.default.$transaction(allCabalOperations)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, pris_client_1.default.cronTracker.update({
                            where: { id: cronTracker.id },
                            data: { status: "SUCCESS" }
                        })];
                case 11:
                    _a.sent();
                    return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Wallets updated successfuly" })];
                case 12:
                    err_1 = _a.sent();
                    return [4 /*yield*/, pris_client_1.default.cronTracker.update({
                            where: { id: cronTracker.id },
                            data: {
                                status: "FAIL"
                            }
                        })];
                case 13:
                    _a.sent();
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "An error was encountered" })];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.updateWallets = updateWallets;
