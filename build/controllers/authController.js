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
exports.reverifyToken = exports.credentialSignIn = exports.googleSignUp = exports.otpVerificationSign = exports.createNewUser = void 0;
var response_handler_1 = __importDefault(require("../utils/response-handler"));
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var catch_async_1 = __importDefault(require("../utils/catch-async"));
var util_1 = require("../utils/util");
var send_mail_1 = require("../utils/send-mail");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var googleRequest_1 = require("../request/googleRequest");
var util_2 = require("../utils/util");
exports.createNewUser = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, firstName, lastName, password, isExisting, merchantID, hashedPassword, newUser, otpCode, newOtpObject;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("in here");
                _a = req.body, email = _a.email, firstName = _a.firstName, lastName = _a.lastName, password = _a.password;
                return [4 /*yield*/, pris_client_1.default.user.findUnique({
                        where: {
                            email: email
                        }
                    })
                    //check if email exists
                ];
            case 1:
                isExisting = _b.sent();
                //check if email exists
                console.log(isExisting);
                if (isExisting) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Email already in Use" })];
                }
                merchantID = "#".concat((0, util_1.generateMerchantID)());
                return [4 /*yield*/, (0, util_1.bcryptHash)(password)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, pris_client_1.default.user.create({
                        data: {
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            isVerified: false, isGoogleUser: false,
                            merchantID: merchantID,
                            password: hashedPassword
                        }
                    })
                    //create new OTp
                ];
            case 3:
                newUser = _b.sent();
                otpCode = (0, util_1.generateOTP)();
                return [4 /*yield*/, pris_client_1.default.mailVerificationOTp.create({
                        data: {
                            userId: newUser.id,
                            expiredTime: (0, util_1.getTimeFromNow)(Number(process.env.OTP_EXPIRY_MINUTE)),
                            otpCode: otpCode
                        }
                    })];
            case 4:
                newOtpObject = _b.sent();
                return [4 /*yield*/, (0, send_mail_1.mailSender)({ to: email, subject: "Utilor Sign up Otp", body: otpCode, name: "".concat(firstName, " ").concat(lastName) })];
            case 5:
                _b.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: { verifyToken: newOtpObject.id } })];
        }
    });
}); });
exports.otpVerificationSign = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, verifyToken, otpCode, otpVerification, currentDate, updatedUser, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, verifyToken = _a.verifyToken, otpCode = _a.otpCode;
                return [4 /*yield*/, pris_client_1.default.mailVerificationOTp.findFirst({
                        where: {
                            AND: [
                                { id: verifyToken },
                                { otpCode: otpCode }
                            ]
                        },
                        include: {
                            user: true
                        }
                    })];
            case 1:
                otpVerification = _b.sent();
                console.log(otpVerification === null || otpVerification === void 0 ? void 0 : otpVerification.user);
                if (!otpVerification) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "OTP supplied invalid" })];
                }
                currentDate = new Date();
                if (currentDate > otpVerification.expiredTime) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "OTP supplied invalid" })];
                }
                return [4 /*yield*/, pris_client_1.default.user.update({
                        where: {
                            id: otpVerification.user.id
                        },
                        data: {
                            isVerified: true
                        },
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            isVerified: true
                        }
                    })
                    //delete all OTp associated with user
                ];
            case 2:
                updatedUser = _b.sent();
                //delete all OTp associated with user
                return [4 /*yield*/, pris_client_1.default.mailVerificationOTp.delete({
                        where: {
                            id: otpVerification.id
                        }
                    })
                    //create jwt to Sign In user
                ];
            case 3:
                //delete all OTp associated with user
                _b.sent();
                token = jsonwebtoken_1.default.sign({ id: updatedUser.id, email: updatedUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: {
                            token: token,
                            user: updatedUser
                        } })];
        }
    });
}); });
exports.googleSignUp = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var googleToken, userData, isExisting, hashedPassword, merchantID, newUser, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                googleToken = req.body.googleToken;
                return [4 /*yield*/, (0, googleRequest_1.getUserCredentials)({ googleToken: googleToken })];
            case 1:
                userData = _a.sent();
                console.log(userData);
                if (!userData) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Google Token Invalid" })];
                }
                return [4 /*yield*/, pris_client_1.default.user.findUnique({
                        where: {
                            email: userData.email
                        }
                    })];
            case 2:
                isExisting = _a.sent();
                if (isExisting) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Email already in use" })];
                }
                return [4 /*yield*/, (0, util_1.bcryptHash)("".concat(userData.id).concat(process.env.JWT_SECRET))];
            case 3:
                hashedPassword = _a.sent();
                merchantID = "#".concat((0, util_1.generateMerchantID)());
                return [4 /*yield*/, pris_client_1.default.user.create({
                        data: {
                            email: userData.email,
                            firstName: userData.given_name || "",
                            lastName: userData.family_name || "",
                            isGoogleUser: true,
                            isVerified: true,
                            password: hashedPassword,
                            merchantID: merchantID
                        }
                    })
                    //create jwt to Sign In user
                ];
            case 4:
                newUser = _a.sent();
                token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: {
                            token: token,
                            user: {
                                id: newUser.id,
                                email: newUser.email,
                                firstName: newUser.firstName,
                                lastName: newUser.lastName,
                                isVerified: true
                            }
                        } })];
        }
    });
}); });
exports.credentialSignIn = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordValid, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, pris_client_1.default.user.findUnique({
                        where: { email: email }
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Invalid Sign In details" })];
                }
                if (user.isGoogleUser) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Sign In with google account" })];
                }
                return [4 /*yield*/, (0, util_2.bcryptCompare)({ hashedPassword: user.password, password: password })];
            case 2:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Invalid Sign In details" })];
                }
                if (!user.isVerified) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 403, error: "Email unverified" })];
                }
                token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: {
                            token: token,
                            user: {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                isVerified: true
                            }
                        } })];
        }
    });
}); });
exports.reverifyToken = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var verifyToken, token, otpCode, otp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                verifyToken = req.body.verifyToken;
                return [4 /*yield*/, pris_client_1.default.mailVerificationOTp.findUnique({
                        where: {
                            id: verifyToken
                        },
                        include: {
                            user: true
                        }
                    })];
            case 1:
                token = _a.sent();
                if (!token) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Token invalid " })];
                }
                return [4 /*yield*/, pris_client_1.default.mailVerificationOTp.deleteMany({
                        where: {
                            userId: token.user.id
                        }
                    })];
            case 2:
                _a.sent();
                otpCode = (0, util_1.generateOTP)();
                return [4 /*yield*/, pris_client_1.default.mailVerificationOTp.create({
                        data: {
                            otpCode: otpCode,
                            userId: token.user.id,
                            expiredTime: (0, util_1.getTimeFromNow)(Number(process.env.OTP_EXPIRY_MINUTE)),
                        }
                    })];
            case 3:
                otp = _a.sent();
                return [4 /*yield*/, (0, send_mail_1.mailSender)({ to: token.user.email, subject: "Utilor SignInOTp", body: otp.otpCode, name: "".concat(token.user.firstName, " ").concat(token.user.lastName) })];
            case 4:
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: { verifyToken: otp.id } })];
        }
    });
}); });
