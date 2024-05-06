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
exports.setAuthCredentials = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var clientDevice_1 = require("./clientDevice");
var util_1 = require("./util");
var send_mail_1 = require("./send-mail");
var CookieService_1 = require("./CookieService");
function setAuthCredentials(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var acessToken, refreshToken, deviceId, isDeviceActive, otpCode, newDeviceOtp, isSessionExisting;
        var req = _b.req, res = _b.res, id = _b.id, email = _b.email;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    acessToken = jsonwebtoken_1.default.sign({ id: id, email: email }, process.env.JWT_SECRET, { expiresIn: "2m" });
                    refreshToken = jsonwebtoken_1.default.sign({ userid: id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    deviceId = (0, clientDevice_1.generateDeviceId)(req);
                    return [4 /*yield*/, pris_client_1.default.userDevices.findFirst({
                            where: {
                                device: deviceId,
                                userId: id
                            }
                        })];
                case 1:
                    isDeviceActive = _c.sent();
                    console.log(isDeviceActive, "device active");
                    if (!!isDeviceActive) return [3 /*break*/, 4];
                    otpCode = (0, util_1.generateOTP)();
                    return [4 /*yield*/, pris_client_1.default.verificationOTp.create({
                            data: {
                                otpCode: otpCode,
                                expiredTime: (0, util_1.getTimeFromNow)(Number(process.env.OTP_EXPIRY_MINUTE)),
                                userId: id,
                                type: "DEVICEVERIFCATION"
                            }
                        })];
                case 2:
                    newDeviceOtp = _c.sent();
                    return [4 /*yield*/, (0, send_mail_1.mailSender)({ to: email, subject: "Utilor Sign In Identification", body: otpCode, name: "Confirm Identiy" })];
                case 3:
                    _c.sent();
                    (0, CookieService_1.setCookie)({ res: res, name: 'identityToken', value: newDeviceOtp.id });
                    return [2 /*return*/, false];
                case 4: return [4 /*yield*/, pris_client_1.default.session.findFirst({
                        where: {
                            deviceId: deviceId,
                            userId: id
                        }
                    })];
                case 5:
                    isSessionExisting = _c.sent();
                    if (!isSessionExisting) return [3 /*break*/, 7];
                    return [4 /*yield*/, pris_client_1.default.session.update({
                            where: { id: isSessionExisting.id },
                            data: {
                                token: refreshToken,
                                expiredAt: (0, util_1.getTimeFromNow)(60)
                            }
                        })];
                case 6:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 7: 
                //create new session for user 
                return [4 /*yield*/, pris_client_1.default.session.create({
                        data: {
                            userId: id,
                            token: refreshToken,
                            deviceId: deviceId,
                            expiredAt: (0, util_1.getTimeFromNow)(60)
                        }
                    })];
                case 8:
                    //create new session for user 
                    _c.sent();
                    _c.label = 9;
                case 9:
                    (0, CookieService_1.setCookie)({ res: res, name: "acessToken", value: acessToken });
                    (0, CookieService_1.setCookie)({ res: res, name: "refreshToken", value: refreshToken });
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.setAuthCredentials = setAuthCredentials;
