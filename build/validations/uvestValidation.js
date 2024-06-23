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
exports.mutaulFundDepositValidation = exports.startMutaulFundInvestmentValidation = exports.updateUnitPriceValidation = exports.updateUVestRateValidation = exports.createUvestValidation = exports.depositUWalletValidation = void 0;
var joi_1 = __importDefault(require("joi"));
var response_handler_1 = __importDefault(require("../utils/response-handler"));
var client_1 = require("@prisma/client");
function depositUWalletValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var depositSchema, validation, error;
        var _a;
        return __generator(this, function (_b) {
            depositSchema = joi_1.default.object({
                id: joi_1.default.string().required(),
                amount: joi_1.default.number().required().min(1),
                currency: (_a = joi_1.default.string()).valid.apply(_a, Object.values(client_1.CURRENCY)).required(),
                paymentMethod: joi_1.default.string().valid("CARD", "BANK").required()
            });
            validation = depositSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.depositUWalletValidation = depositUWalletValidation;
function createUvestValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var createNewUVestFundSchema, validation, error;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            createNewUVestFundSchema = joi_1.default.object({
                companyName: joi_1.default.string().required(),
                currency: (_a = joi_1.default.string()).valid.apply(_a, Object.values(client_1.CURRENCY)).required(),
                unitPrice: joi_1.default.number().required().min(0),
                historicPerformance: joi_1.default.array().items(joi_1.default.object({
                    year: joi_1.default.string().required(),
                    performance: joi_1.default.number().required()
                })).required(),
                annualReturns: joi_1.default.number().required(),
                companyLogo: joi_1.default.string().required(),
                about: joi_1.default.string().required(),
                howYouEarn: joi_1.default.string().required(),
                termsOfUse: joi_1.default.string().required(),
                investmentType: (_b = joi_1.default.string()).valid.apply(_b, Object.values(client_1.InvestmentType)).required(),
                dividendDuration: (_c = joi_1.default.string()).valid.apply(_c, Object.values(client_1.DividendDuration)).required(),
                nextDividendDate: joi_1.default.date().iso().required(),
            });
            validation = createNewUVestFundSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.createUvestValidation = createUvestValidation;
function updateUVestRateValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var createNewUVestFundSchema, validation, error;
        return __generator(this, function (_a) {
            createNewUVestFundSchema = joi_1.default.object({
                mutualId: joi_1.default.string().required(),
                rate: joi_1.default.number().required(),
            });
            validation = createNewUVestFundSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.updateUVestRateValidation = updateUVestRateValidation;
function updateUnitPriceValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var createNewUVestFundSchema, validation, error;
        return __generator(this, function (_a) {
            createNewUVestFundSchema = joi_1.default.object({
                mutualId: joi_1.default.string().required(),
                unitPrice: joi_1.default.number().required(),
            });
            validation = createNewUVestFundSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.updateUnitPriceValidation = updateUnitPriceValidation;
function startMutaulFundInvestmentValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var createNewUVestFundSchema, validation, error;
        return __generator(this, function (_a) {
            createNewUVestFundSchema = joi_1.default.object({
                mutualId: joi_1.default.string().required(),
            });
            validation = createNewUVestFundSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.startMutaulFundInvestmentValidation = startMutaulFundInvestmentValidation;
function mutaulFundDepositValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var createNewUVestFundSchema, validation, error;
        return __generator(this, function (_a) {
            createNewUVestFundSchema = joi_1.default.object({
                mutualId: joi_1.default.string().required(),
                numberOfUnits: joi_1.default.number().required(),
                pin: joi_1.default.string().required(),
                paymentMethod: joi_1.default.string().valid("CARD", "BANK", "UWALLET").required(),
            });
            validation = createNewUVestFundSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.mutaulFundDepositValidation = mutaulFundDepositValidation;
