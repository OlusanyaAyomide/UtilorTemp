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
exports.verifyUserStats = void 0;
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var util_1 = require("../utils/util");
var send_mail_1 = require("../utils/send-mail");
var response_handler_1 = __importDefault(require("../utils/response-handler"));
var clientDevice_1 = require("../utils/clientDevice");
function verifyUserStats(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, otpCode, newOtpObject, deviceId, isDeviceActive, otpCode, newDeviceOtp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //check is user email is verified
                    if (!req.user) {
                        return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "verify users first before this middleware" })];
                    }
                    user = req.user;
                    if (!!(user === null || user === void 0 ? void 0 : user.isMailVerified)) return [3 /*break*/, 3];
                    otpCode = (0, util_1.generateOTP)();
                    return [4 /*yield*/, pris_client_1.default.verificationOTp.create({
                            data: {
                                userId: (user === null || user === void 0 ? void 0 : user.userId) || "",
                                expiredTime: (0, util_1.getTimeFromNow)(Number(process.env.OTP_EXPIRY_MINUTE)),
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
                    res.cookie("MAILVERIFICATION", newOtpObject.id, {
                        maxAge: 30 * 60 * 1000,
                        secure: true,
                        httpOnly: true,
                        // signed:true,
                    });
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 401, error: "Email unverified, Check email for OTP code" })];
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
                                expiredTime: (0, util_1.getTimeFromNow)(Number(process.env.OTP_EXPIRY_MINUTE)),
                                userId: (user === null || user === void 0 ? void 0 : user.userId) || "",
                                type: "DEVICEVERIFCATION"
                            }
                        })];
                case 5:
                    newDeviceOtp = _a.sent();
                    return [4 /*yield*/, (0, send_mail_1.mailSender)({ to: (user === null || user === void 0 ? void 0 : user.email) || "", subject: "Utilor Sign In Identification", body: otpCode, name: "Confirm Identiy" })];
                case 6:
                    _a.sent();
                    res.cookie("identityToken", newDeviceOtp.id, {
                        maxAge: 30 * 60 * 1000,
                        secure: true,
                        httpOnly: true,
                        // signed:true,
                    });
                    return [2 /*return*/, response_handler_1.default.sendUnauthorizedResponse({ res: res, error: "Verify device" })];
                case 7: return [2 /*return*/, next()];
            }
        });
    });
}
exports.verifyUserStats = verifyUserStats;
