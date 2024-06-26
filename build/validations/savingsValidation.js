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
exports.cabalWithdrawalidation = exports.uAndIValidation = exports.emergencyUWithdrawalValidation = exports.forUWithdrawalValidation = exports.savingsInterestValidation = exports.addPromoCodeValidation = exports.startCabalValidation = exports.sendCabalInvitationValidation = exports.createCabalValidation = exports.createUAndIValidation = exports.depositUWalletValidation = exports.depositForUValidation = exports.createForUValidation = void 0;
var joi_1 = __importDefault(require("joi"));
var response_handler_1 = __importDefault(require("../utils/response-handler"));
var client_1 = require("@prisma/client");
function createForUValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var currencyRegex, investmentSchema, validation, error;
        return __generator(this, function (_a) {
            currencyRegex = /^(NGN|USD)$/;
            investmentSchema = joi_1.default.object({
                currency: joi_1.default.string().required().regex(currencyRegex).message('Currency must be either NGN or USD'),
                savingsName: joi_1.default.string().required(),
                expectedDepositDay: joi_1.default.number().integer().required(),
                expectedMonthlyAmount: joi_1.default.number().integer().required(),
                // amount:Joi.number().required().min(5000),
                endingDate: joi_1.default.date().iso().required(),
                iconLink: joi_1.default.string().required()
            });
            validation = investmentSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.createForUValidation = createForUValidation;
function depositForUValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var paymentMethodRegex, depositSchema, validation, error;
        return __generator(this, function (_a) {
            paymentMethodRegex = /^(UWALLET|BANK|CARD)$/;
            depositSchema = joi_1.default.object({
                id: joi_1.default.string().required(),
                amount: joi_1.default.number().required().min(1),
                paymentMethod: joi_1.default.string().required().regex(paymentMethodRegex).message("Payment method must be either 'UWALLET', 'BANK', or 'CARD'"),
                pin: joi_1.default.string().required(),
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
exports.depositForUValidation = depositForUValidation;
//should be moved
function depositUWalletValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var depositSchema, validation, error;
        var _a;
        return __generator(this, function (_b) {
            depositSchema = joi_1.default.object({
                id: joi_1.default.string().required(),
                amount: joi_1.default.number().required().min(1),
                currency: (_a = joi_1.default.string()).valid.apply(_a, Object.values(client_1.CURRENCY)).required(),
                paymentMethod: joi_1.default.string().valid("CARD", "BANK").required(),
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
function createUAndIValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var currencyRegex, investmentSchema, validation, error;
        return __generator(this, function (_a) {
            currencyRegex = /^(NGN|USD)$/;
            investmentSchema = joi_1.default.object({
                currency: joi_1.default.string().required().regex(currencyRegex).message('Currency must be either NGN or USD'),
                savingsName: joi_1.default.string().required(),
                expectedDepositDay: joi_1.default.number().integer().required(),
                expectedMonthlyAmount: joi_1.default.number().integer().required(),
                // amount:Joi.number().required().min(5000),
                endingDate: joi_1.default.date().iso().required(),
                consentToken: joi_1.default.string().min(9).required(),
                iconLink: joi_1.default.string().required(),
            });
            validation = investmentSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.createUAndIValidation = createUAndIValidation;
function createCabalValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var investmentSchema, validation, error;
        var _a;
        return __generator(this, function (_b) {
            investmentSchema = joi_1.default.object({
                lockedInDate: joi_1.default.date().iso().required(),
                groupName: joi_1.default.string(),
                currency: (_a = joi_1.default.string()).valid.apply(_a, Object.values(client_1.CURRENCY)).required(),
                iconLink: joi_1.default.string().required(),
                description: joi_1.default.string().required()
            });
            validation = investmentSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.createCabalValidation = createCabalValidation;
function sendCabalInvitationValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var investmentSchema, validation, error;
        return __generator(this, function (_a) {
            investmentSchema = joi_1.default.object({
                merchantId: joi_1.default.string().required(),
                cabalId: joi_1.default.string().required()
            });
            validation = investmentSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.sendCabalInvitationValidation = sendCabalInvitationValidation;
function startCabalValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var investmentSchema, validation, error;
        return __generator(this, function (_a) {
            investmentSchema = joi_1.default.object({
                cabalId: joi_1.default.string().required()
            });
            validation = investmentSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.startCabalValidation = startCabalValidation;
function addPromoCodeValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var investmentSchema, validation, error;
        return __generator(this, function (_a) {
            investmentSchema = joi_1.default.object({
                savingsId: joi_1.default.string().required(),
                promoCode: joi_1.default.string().required()
            });
            validation = investmentSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.addPromoCodeValidation = addPromoCodeValidation;
function savingsInterestValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var investmentSchema, validation, error;
        return __generator(this, function (_a) {
            investmentSchema = joi_1.default.object({
                duration: joi_1.default.number().required(),
            });
            validation = investmentSchema.validate(req.query);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.savingsInterestValidation = savingsInterestValidation;
function forUWithdrawalValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var investmentSchema, validation, error;
        return __generator(this, function (_a) {
            investmentSchema = joi_1.default.object({
                forUId: joi_1.default.string().required(),
                amount: joi_1.default.number().required()
            });
            validation = investmentSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.forUWithdrawalValidation = forUWithdrawalValidation;
function emergencyUWithdrawalValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var investmentSchema, validation, error;
        return __generator(this, function (_a) {
            investmentSchema = joi_1.default.object({
                emergencyId: joi_1.default.string().required(),
                amount: joi_1.default.number().required()
            });
            validation = investmentSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.emergencyUWithdrawalValidation = emergencyUWithdrawalValidation;
function uAndIValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var investmentSchema, validation, error;
        return __generator(this, function (_a) {
            investmentSchema = joi_1.default.object({
                uAndIId: joi_1.default.string().required(),
                amount: joi_1.default.number().required()
            });
            validation = investmentSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.uAndIValidation = uAndIValidation;
function cabalWithdrawalidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var investmentSchema, validation, error;
        return __generator(this, function (_a) {
            investmentSchema = joi_1.default.object({
                cabalGroupId: joi_1.default.string().required(),
                amount: joi_1.default.number().required()
            });
            validation = investmentSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.cabalWithdrawalidation = cabalWithdrawalidation;
