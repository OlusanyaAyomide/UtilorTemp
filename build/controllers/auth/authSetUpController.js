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
exports.updateDobAndBvn = exports.createPin = exports.credentialSignIn = void 0;
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var clientDevice_1 = require("../../utils/clientDevice");
var send_mail_1 = require("../../utils/send-mail");
var util_1 = require("../../utils/util");
var util_2 = require("../../utils/util");
var catch_async_1 = __importDefault(require("../../utils/catch-async"));
var CookieService_1 = require("../../utils/CookieService");
//in charge of asigning token and signing in users
exports.credentialSignIn = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, otpCode, newOtpObject, deviceId, isDeviceActive, otpCode, newDeviceOtp, acessToken, refreshToken, isSessionExisting, currentDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!!(user === null || user === void 0 ? void 0 : user.isMailVerified)) return [3 /*break*/, 3];
                otpCode = (0, util_1.generateOTP)();
                return [4 /*yield*/, pris_client_1.default.verificationOTp.create({
                        data: {
                            userId: (user === null || user === void 0 ? void 0 : user.userId) || "",
                            expiredTime: (0, util_2.getTimeFromNow)(Number(process.env.OTP_EXPIRY_MINUTE)),
                            otpCode: otpCode,
                            type: "MAILVERIFICATION"
                        }
                    })];
            case 1:
                newOtpObject = _a.sent();
                return [4 /*yield*/, (0, send_mail_1.mailSender)({ to: (user === null || user === void 0 ? void 0 : user.email) || "", subject: "Utilor Sign up code", body: otpCode, name: "Utilor Verifcation" })
                    //set otpId to user response cookie 
                ];
            case 2:
                _a.sent();
                //set otpId to user response cookie 
                (0, CookieService_1.setCookie)({ res: res, name: "MAILVERIFICATION", value: newOtpObject.id });
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 401, error: "Email unverified, Check email for OTP code", status_code: "EMAIL_REDIRECT" })];
            case 3:
                deviceId = (0, clientDevice_1.generateDeviceId)(req);
                return [4 /*yield*/, pris_client_1.default.userDevices.findFirst({
                        where: {
                            device: deviceId,
                            userId: user === null || user === void 0 ? void 0 : user.userId
                        }
                    })
                    //check if user device is recognised
                ];
            case 4:
                isDeviceActive = _a.sent();
                //check if user device is recognised
                console.log(isDeviceActive, "device active");
                if (!!isDeviceActive) return [3 /*break*/, 7];
                otpCode = (0, util_1.generateOTP)();
                return [4 /*yield*/, pris_client_1.default.verificationOTp.create({
                        data: {
                            otpCode: otpCode,
                            expiredTime: (0, util_2.getTimeFromNow)(Number(process.env.OTP_EXPIRY_MINUTE)),
                            userId: (user === null || user === void 0 ? void 0 : user.userId) || "",
                            type: "DEVICEVERIFCATION"
                        }
                    })];
            case 5:
                newDeviceOtp = _a.sent();
                return [4 /*yield*/, (0, send_mail_1.mailSender)({ to: (user === null || user === void 0 ? void 0 : user.email) || "", subject: "Utilor Sign In Identification", body: otpCode, name: "Confirm Identiy" })];
            case 6:
                _a.sent();
                (0, CookieService_1.setCookie)({ res: res, name: "identityToken", value: newDeviceOtp.id });
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Verify device", code: 403, status_code: "VERIFY_DEVICE" })];
            case 7:
                if (!user.firstName) {
                    res.clearCookie("MAILVERIFICATION");
                    (0, CookieService_1.setCookie)({ res: res, name: "CLIENTEMAIL", value: user.email });
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Profile not completed", code: 403, status_code: "COMPLETE_PROFILE" })];
                }
                acessToken = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user.userId, email: user === null || user === void 0 ? void 0 : user.email, isCredentialsSet: user.isCredentialsSet, isGoogleUser: user.isGoogleUser, isMailVerified: user.isMailVerified, firstName: user.firstName, lastName: user.lastName }, process.env.JWT_SECRET, { expiresIn: "6m" });
                refreshToken = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user.userId }, process.env.JWT_SECRET, { expiresIn: "62m" });
                return [4 /*yield*/, pris_client_1.default.session.findFirst({
                        where: {
                            deviceId: deviceId,
                            userId: user === null || user === void 0 ? void 0 : user.userId,
                        }
                    })];
            case 8:
                isSessionExisting = _a.sent();
                if (!isSessionExisting) return [3 /*break*/, 10];
                currentDate = new Date();
                return [4 /*yield*/, pris_client_1.default.session.update({
                        where: { id: isSessionExisting.id },
                        data: {
                            token: refreshToken,
                            expiredAt: (0, util_2.getTimeFromNow)(60),
                            createdAt: currentDate
                        }
                    })];
            case 9:
                _a.sent();
                return [3 /*break*/, 12];
            case 10: 
            //create new session for user 
            return [4 /*yield*/, pris_client_1.default.session.create({
                    data: {
                        userId: (user === null || user === void 0 ? void 0 : user.userId) || "",
                        token: refreshToken,
                        deviceId: deviceId,
                        expiredAt: (0, util_2.getTimeFromNow)(60),
                    }
                })];
            case 11:
                //create new session for user 
                _a.sent();
                _a.label = 12;
            case 12:
                (0, CookieService_1.setCookie)({ res: res, name: "acessToken", value: acessToken, duration: 5 });
                (0, CookieService_1.setCookie)({ res: res, name: "refreshToken", value: refreshToken, duration: 60 });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: {
                            user: {
                                id: user === null || user === void 0 ? void 0 : user.userId,
                                email: user === null || user === void 0 ? void 0 : user.email,
                                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                                isMailVerified: user.isMailVerified,
                            }
                        } })];
        }
    });
}); });
exports.createPin = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, pin, hashedPin, pinAlreadyExists;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Server Error", code: 500 })];
                }
                pin = req.body.pin;
                return [4 /*yield*/, (0, util_1.bcryptHash)(pin)];
            case 1:
                hashedPin = _a.sent();
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: { email: user.email },
                        select: { pin: true }
                    })];
            case 2:
                pinAlreadyExists = _a.sent();
                if (pinAlreadyExists === null || pinAlreadyExists === void 0 ? void 0 : pinAlreadyExists.pin) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "PIN already set up", code: 409 })];
                }
                return [4 /*yield*/, pris_client_1.default.user.update({
                        where: { id: user.userId },
                        data: {
                            pin: hashedPin
                        }
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: {
                            message: "PIN setup successfully"
                        } })];
        }
    });
}); });
exports.updateDobAndBvn = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bvnNumber, dateOfBirth, user, userData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, bvnNumber = _a.bvnNumber, dateOfBirth = _a.dateOfBirth;
                user = req.user;
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Server Error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.user.findFirst({ where: { id: user.userId } })];
            case 1:
                userData = _b.sent();
                if (userData === null || userData === void 0 ? void 0 : userData.BvnNumber) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Bvn And Date Of Birth Already set" })];
                }
                return [4 /*yield*/, pris_client_1.default.user.update({
                        where: { id: user.userId },
                        data: {
                            BvnNumber: bvnNumber,
                            dateOfBirth: dateOfBirth
                        }
                    })];
            case 2:
                _b.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Details successfully updated" })];
        }
    });
}); });
