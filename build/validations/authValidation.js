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
exports.updateBvnValidation = exports.createPinValidation = exports.resetPasswordValidation = exports.forgotPasswordValidation = exports.newDeviceValidation = exports.resendForgotPasswordValidation = exports.resendTokenValidation = exports.googleSignUpValidation = exports.credentialSignInValidation = exports.basicSetUpValidation = exports.otpvalidation = exports.signUpValidation = void 0;
var joi_1 = __importDefault(require("joi"));
var response_handler_1 = __importDefault(require("../utils/response-handler"));
function signUpValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var emailRegex, signUpSchema, validation, error;
        return __generator(this, function (_a) {
            emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            console.log(req.cookies);
            signUpSchema = joi_1.default.object({
                email: joi_1.default.string().required().regex(emailRegex).message('Email is not valid'),
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
function otpvalidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var otpSchema, validation, error;
        return __generator(this, function (_a) {
            otpSchema = joi_1.default.object({
                otpCode: joi_1.default.string().required().length(4),
                MAILVERIFICATION: joi_1.default.string().uuid().required()
            });
            validation = otpSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.otpvalidation = otpvalidation;
function basicSetUpValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var passwordRegex, signUpSchema, validation, error;
        return __generator(this, function (_a) {
            passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z0-9!@#$%^&*]).{8,}$/;
            signUpSchema = joi_1.default.object({
                email: joi_1.default.string().email().required(),
                firstName: joi_1.default.string().required(),
                lastName: joi_1.default.string().required().allow(''),
                password: joi_1.default.string().required().regex(passwordRegex).message('Password is not strong enough'),
                confirmPassword: joi_1.default.string().required().valid(joi_1.default.ref('password')).error(new Error('Password mismatch')),
                phoneNumber: joi_1.default.string().max(15).required(),
                merchantID: joi_1.default.string().optional()
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
exports.basicSetUpValidation = basicSetUpValidation;
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
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.credentialSignInValidation = credentialSignInValidation;
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
                MAILVERIFICATION: joi_1.default.string().uuid().required()
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
function resendForgotPasswordValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var schema, validation, error;
        return __generator(this, function (_a) {
            schema = joi_1.default.object({
                resendToken: joi_1.default.string().uuid().required()
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
exports.resendForgotPasswordValidation = resendForgotPasswordValidation;
function newDeviceValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var schema, validation, error, verificationId;
        return __generator(this, function (_a) {
            schema = joi_1.default.object({
                otpCode: joi_1.default.string().required().length(4),
            });
            validation = schema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            verificationId = req.cookies["identityToken"];
            if (!verificationId) {
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Verifcation session exppired", status_code: "LOGIN_REDIRECT" })];
            }
            return [2 /*return*/, next()];
        });
    });
}
exports.newDeviceValidation = newDeviceValidation;
function forgotPasswordValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var schema, validation, error;
        return __generator(this, function (_a) {
            schema = joi_1.default.object({
                email: joi_1.default.string().required(),
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
exports.forgotPasswordValidation = forgotPasswordValidation;
function resetPasswordValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var passwordRegex, schema, validation, error;
        return __generator(this, function (_a) {
            passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z0-9!@#$%^&*]).{8,}$/;
            schema = joi_1.default.object({
                otpCode: joi_1.default.string().required().length(4),
                password: joi_1.default.string().required().regex(passwordRegex).message('Password is not strong enough'),
                resetToken: joi_1.default.string().uuid().required()
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
exports.resetPasswordValidation = resetPasswordValidation;
function createPinValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var schema, validation, error;
        return __generator(this, function (_a) {
            schema = joi_1.default.object({
                pin: joi_1.default.string().required().length(4),
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
exports.createPinValidation = createPinValidation;
function updateBvnValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var schema, validation, error;
        return __generator(this, function (_a) {
            schema = joi_1.default.object({
                bvnNumber: joi_1.default.string().required().max(20),
                dateOfBirth: joi_1.default.date().iso()
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
exports.updateBvnValidation = updateBvnValidation;
