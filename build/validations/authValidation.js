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
exports.resendTokenValidation = exports.googleSignUpValidation = exports.tokenVerifyValidation = exports.otpvalidation = exports.credentialSignInValidation = exports.signUpValidation = void 0;
var joi_1 = __importDefault(require("joi"));
var response_handler_1 = __importDefault(require("../utils/response-handler"));
function signUpValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var emailRegex, passwordRegex, signUpSchema, validation, error;
        return __generator(this, function (_a) {
            emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z0-9!@#$%^&*]).{8,}$/;
            signUpSchema = joi_1.default.object({
                firstName: joi_1.default.string().required(),
                lastName: joi_1.default.string().required().allow(''),
                email: joi_1.default.string().required().regex(emailRegex).message('Email is not valid'),
                password: joi_1.default.string().required().regex(passwordRegex).message('Password is not strong enough'),
                referralId: joi_1.default.string().optional(),
                confirmPassword: joi_1.default.string().required().valid(joi_1.default.ref('password')).error(new Error('Password mismatch')),
                isAgreed: joi_1.default.boolean().required().valid(true).error(new Error('Accept terms and conditions')),
            });
            validation = signUpSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.signUpValidation = signUpValidation;
function credentialSignInValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var emailRegex, passwordRegex, signInSchema, validation, error;
        return __generator(this, function (_a) {
            emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z0-9!@#$%^&*]).{8,}$/;
            signInSchema = joi_1.default.object({
                email: joi_1.default.string().required().regex(emailRegex).message('Email is not valid'),
                password: joi_1.default.string().required().regex(passwordRegex).message('Password is not strong enough'),
            });
            validation = signInSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.credentialSignInValidation = credentialSignInValidation;
function otpvalidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var otpSchema, validation, error;
        return __generator(this, function (_a) {
            otpSchema = joi_1.default.object({
                otpCode: joi_1.default.string().required().length(4),
                verifyToken: joi_1.default.string().optional()
            });
            validation = otpSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.otpvalidation = otpvalidation;
function tokenVerifyValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenVerifySchema, validation, error;
        return __generator(this, function (_a) {
            tokenVerifySchema = joi_1.default.object({
                otpCode: joi_1.default.string().required().length(4),
                verifyToken: joi_1.default.string().required()
            });
            validation = tokenVerifySchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 401, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.tokenVerifyValidation = tokenVerifyValidation;
function googleSignUpValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var schema, validation, error;
        return __generator(this, function (_a) {
            schema = joi_1.default.object({
                googleToken: joi_1.default.string().required()
            });
            validation = schema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.googleSignUpValidation = googleSignUpValidation;
function resendTokenValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var schema, validation, error;
        return __generator(this, function (_a) {
            schema = joi_1.default.object({
                verifyToken: joi_1.default.string().required()
            });
            validation = schema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.resendTokenValidation = resendTokenValidation;
