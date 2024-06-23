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
exports.getUserMutualFundPortFolioDetail = exports.getIndividualFundCompany = exports.getMutualFundCompanies = void 0;
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var catch_async_1 = __importDefault(require("../../utils/catch-async"));
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
exports.getMutualFundCompanies = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, investmentType, investmentCurrency, mutualFunds;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                investmentType = req.query.investmentType;
                investmentCurrency = req.query.currency;
                return [4 /*yield*/, pris_client_1.default.mutualFundCompanies.findMany({
                        where: {
                            investmentType: investmentType,
                            currency: investmentCurrency,
                        }
                    })];
            case 1:
                mutualFunds = _b.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: mutualFunds })];
        }
    });
}); });
exports.getIndividualFundCompany = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, mutualFundId, mutualFunds;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                mutualFundId = req.params.id;
                return [4 /*yield*/, pris_client_1.default.mutualFundCompanies.findFirst({
                        where: {
                            id: mutualFundId
                        },
                        include: {
                            priceHistory: {
                                orderBy: {
                                    createdAt: "desc"
                                }
                            },
                            historicPerformance: true
                        }
                    })];
            case 1:
                mutualFunds = _b.sent();
                if (!mutualFunds) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Mutaul Fund Company not found" })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: mutualFunds })];
        }
    });
}); });
exports.getUserMutualFundPortFolioDetail = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, mutualFundId, mutualFunds, portfolio;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                mutualFundId = req.params.id;
                return [4 /*yield*/, pris_client_1.default.mutualFundCompanies.findFirst({
                        where: {
                            id: mutualFundId
                        },
                    })];
            case 1:
                mutualFunds = _b.sent();
                if (!mutualFunds) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Mutaul Fund Company not found" })];
                }
                return [4 /*yield*/, pris_client_1.default.userMutualFund.findFirst({
                        where: {
                            mutualFundId: mutualFundId,
                            userId: userId
                        },
                        select: {
                            visibleBalance: true,
                            autoRenew: true,
                            isActive: true,
                            createdAt: true,
                            capital: true
                        },
                    })];
            case 2:
                portfolio = _b.sent();
                if (!portfolio) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No active investment for this company" })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: __assign(__assign({}, mutualFunds), { portfolio: __assign(__assign({}, portfolio), { unitAmount: portfolio.visibleBalance / mutualFunds.unitPrice }) }) })];
        }
    });
}); });
