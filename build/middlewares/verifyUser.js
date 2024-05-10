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
exports.verifyUsers = void 0;
var response_handler_1 = __importDefault(require("../utils/response-handler"));
var clientDevice_1 = require("../utils/clientDevice");
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var util_1 = require("../utils/util");
var CookieService_1 = require("../utils/CookieService");
function verifyUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var refreshToken, accessToken, decoded, deviceId, isTokenValid, user, newAcessToken, newRefreshToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    refreshToken = req.cookies['refreshToken'];
                    accessToken = req.cookies['acessToken'];
                    if (accessToken) {
                        try {
                            decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
                            if (decoded.userId) {
                                req.user = decoded;
                                return [2 /*return*/, next()];
                            }
                            else {
                                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Token malformed", code: 401, status_code: "LOGIN_REDIRECT" })];
                            }
                        }
                        catch (err) {
                            return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Token malformed", code: 401, status_code: "LOGIN_REDIRECT" })];
                        }
                    }
                    if (!refreshToken) {
                        return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Session Expired 1", code: 401, status_code: "LOGIN_REDIRECT" })];
                    }
                    deviceId = (0, clientDevice_1.generateDeviceId)(req);
                    return [4 /*yield*/, pris_client_1.default.session.findFirst({
                            where: {
                                deviceId: deviceId,
                                token: refreshToken,
                                expiredAt: {
                                    gt: new Date()
                                }
                            },
                            include: {
                                user: true
                            }
                        })];
                case 1:
                    isTokenValid = _a.sent();
                    console.log(isTokenValid);
                    if (!isTokenValid) {
                        return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Token Expired 2", code: 401, status_code: "LOGIN_REDIRECT" })];
                    }
                    user = isTokenValid.user;
                    newAcessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user === null || user === void 0 ? void 0 : user.email, isCredentialsSet: user.isCredentialsSet, isGoogleUser: user.isGoogleUser, isMailVerified: user.isMailVerified, firstName: user.firstName, lastName: user.lastName }, process.env.JWT_SECRET, { expiresIn: "6m" });
                    newRefreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    return [4 /*yield*/, pris_client_1.default.session.update({
                            where: { id: isTokenValid.id },
                            data: {
                                token: newRefreshToken,
                                expiredAt: (0, util_1.getTimeFromNow)(60)
                            }
                        })
                        //set  refresh token to cookie
                    ];
                case 2:
                    _a.sent();
                    //set  refresh token to cookie
                    (0, CookieService_1.setCookie)({ res: res, name: "refreshToken", value: newRefreshToken, duration: 60 });
                    (0, CookieService_1.setCookie)({ res: res, name: "acessToken", value: newAcessToken, duration: 5 });
                    req.user = {
                        userId: user.id,
                        firstName: (user === null || user === void 0 ? void 0 : user.firstName) || "", lastName: (user === null || user === void 0 ? void 0 : user.lastName) || "",
                        isCredentialsSet: true,
                        isGoogleUser: user.isGoogleUser,
                        email: user.email,
                        isMailVerified: user.isMailVerified
                    };
                    return [2 /*return*/, next()];
            }
        });
    });
}
exports.verifyUsers = verifyUsers;
