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
exports.googleSignIn = exports.googleSignUp = exports.resetPassword = exports.forgotPassword = exports.verifyAndAddNewDevice = exports.reverifyToken = exports.userLogIn = exports.completeBasicDetail = exports.mailVerification = exports.createNewUser = void 0;
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var catch_async_1 = __importDefault(require("../../utils/catch-async"));
var util_1 = require("../../utils/util");
var send_mail_1 = require("../../utils/send-mail");
var googleRequest_1 = require("../../request/googleRequest");
var util_2 = require("../../utils/util");
var credentials_setup_1 = require("../../utils/credentials-setup");
var clientDevice_1 = require("../../utils/clientDevice");
var TempRates_1 = require("../../utils/TempRates");
exports.createNewUser = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, existingUser, newUserId, merchantID, newUser, otpCode, otpObject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: { email: email }
                    })
                    //if user exists and mail is verified , send an error message
                ];
            case 1:
                existingUser = _a.sent();
                //if user exists and mail is verified , send an error message
                if (existingUser && existingUser.isMailVerified) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Email Already Existing" })];
                }
                newUserId = "";
                if (!!existingUser) return [3 /*break*/, 4];
                merchantID = "#".concat((0, util_1.generateMerchantID)());
                return [4 /*yield*/, pris_client_1.default.user.create({
                        data: { email: email, isGoogleUser: false, merchantID: merchantID }
                    })];
            case 2:
                newUser = _a.sent();
                newUserId = newUser.id;
                // Create a corresponding new Naira wallet
                return [4 /*yield*/, pris_client_1.default.uWallet.create({
                        data: {
                            balance: 0.0,
                            currency: "NGN",
                            userId: newUser.id
                        }
                    })];
            case 3:
                // Create a corresponding new Naira wallet
                _a.sent();
                _a.label = 4;
            case 4:
                otpCode = (0, util_1.generateOTP)();
                return [4 /*yield*/, (0, send_mail_1.mailSender)({ to: email, subject: "Utilor Sign up code", body: otpCode, name: "Utilor Verifcation" })];
            case 5:
                _a.sent();
                return [4 /*yield*/, pris_client_1.default.verificationOTp.create({
                        data: {
                            otpCode: otpCode,
                            userId: (existingUser === null || existingUser === void 0 ? void 0 : existingUser.id) || newUserId,
                            type: "MAILVERIFICATION",
                            expiredTime: (0, util_1.getTimeFromNow)(Number(process.env.OTP_EXPIRY_MINUTE))
                        }
                    })];
            case 6:
                otpObject = _a.sent();
                res.cookie("MAILVERIFICATION", otpObject.id, {
                    maxAge: 30 * 60 * 1000,
                    secure: true,
                    httpOnly: true,
                });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Verifcation sent to email" })];
        }
    });
}); });
exports.mailVerification = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var otpCode, verificationID, otpVerification, currentDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                otpCode = req.body.otpCode;
                verificationID = req.cookies["MAILVERIFICATION"];
                return [4 /*yield*/, pris_client_1.default.verificationOTp.findFirst({
                        where: {
                            id: verificationID,
                            type: "MAILVERIFICATION",
                            otpCode: otpCode,
                        },
                        include: {
                            user: true
                        }
                    })];
            case 1:
                otpVerification = _a.sent();
                if (!otpVerification) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "OTP Supplied Invalid" })];
                }
                currentDate = new Date();
                if (currentDate > otpVerification.expiredTime) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "OTP supplied Expired" })];
                }
                //update user mail verification status to true
                return [4 /*yield*/, pris_client_1.default.user.update({
                        where: {
                            id: otpVerification.userId
                        },
                        data: {
                            isMailVerified: true
                        },
                    })
                    //delete verifcation token from cookie
                ];
            case 2:
                //update user mail verification status to true
                _a.sent();
                //delete verifcation token from cookie
                res.clearCookie("MAILVERIFICATION");
                //delete all OTp associated with user
                return [4 /*yield*/, pris_client_1.default.verificationOTp.deleteMany({
                        where: {
                            userId: otpVerification.userId, type: "MAILVERIFICATION"
                        }
                    })];
            case 3:
                //delete all OTp associated with user
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Email succesfully verfied" })];
        }
    });
}); });
exports.completeBasicDetail = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, lastName, password, email, phoneNumber, merchantID, existingUser, referredByUser, hashedPassword, user, newuserWallet, referalUserWallet, deviceId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, password = _a.password, email = _a.email, phoneNumber = _a.phoneNumber, merchantID = _a.merchantID;
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: {
                            email: email
                        }
                    })];
            case 1:
                existingUser = _b.sent();
                if (!existingUser) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Email supplied invalid" })];
                }
                //check if user has completely basic detail setup
                if (existingUser.isCredentialsSet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Basic Detail already setup" })];
                }
                referredByUser = null;
                if (!merchantID) return [3 /*break*/, 3];
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: { merchantID: merchantID }
                    })];
            case 2:
                referredByUser = _b.sent();
                if (!referredByUser) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "merchantID is invalid" })];
                }
                _b.label = 3;
            case 3: return [4 /*yield*/, (0, util_1.bcryptHash)(password)
                //update created user information
            ];
            case 4:
                hashedPassword = _b.sent();
                return [4 /*yield*/, pris_client_1.default.user.update({
                        where: { email: email },
                        data: {
                            firstName: firstName,
                            lastName: lastName,
                            password: hashedPassword,
                            phoneNumber: phoneNumber,
                            isCredentialsSet: true,
                            referredById: referredByUser === null || referredByUser === void 0 ? void 0 : referredByUser.id
                        },
                    })
                    //if user is referred update referredBy user with the new referral 
                ];
            case 5:
                user = _b.sent();
                if (!referredByUser) return [3 /*break*/, 11];
                //connect refrerred By User with new user
                return [4 /*yield*/, pris_client_1.default.user.update({
                        where: { id: referredByUser.id },
                        data: {
                            referrals: {
                                connect: {
                                    id: user.id
                                }
                            }
                        }
                    })
                    //update new user referral wallet
                ];
            case 6:
                //connect refrerred By User with new user
                _b.sent();
                return [4 /*yield*/, pris_client_1.default.uWallet.findFirst({
                        where: { userId: user.id, currency: "NGN" }
                    })];
            case 7:
                newuserWallet = _b.sent();
                if (!newuserWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Corresponding wallet is not found" })];
                }
                return [4 /*yield*/, pris_client_1.default.uWallet.update({
                        where: { id: newuserWallet.id },
                        data: { referralBalance: { increment: TempRates_1.referralAmount } }
                    })
                    //update user "that referred new user" wallet
                ];
            case 8:
                _b.sent();
                return [4 /*yield*/, pris_client_1.default.uWallet.findFirst({
                        where: { userId: referredByUser.id, currency: "NGN" },
                    })];
            case 9:
                referalUserWallet = _b.sent();
                if (!referalUserWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Corresponding wallet is not found" })];
                }
                return [4 /*yield*/, pris_client_1.default.uWallet.update({
                        where: { id: referalUserWallet.id },
                        data: {
                            referralBalance: { increment: TempRates_1.referralAmount }
                        }
                    })];
            case 10:
                _b.sent();
                _b.label = 11;
            case 11:
                deviceId = (0, clientDevice_1.generateDeviceId)(req);
                return [4 /*yield*/, pris_client_1.default.userDevices.create({
                        data: {
                            userId: user.id,
                            device: deviceId
                        }
                    })];
            case 12:
                _b.sent();
                req.user = {
                    userId: user.id,
                    firstName: firstName,
                    lastName: lastName,
                    isCredentialsSet: true,
                    isGoogleUser: user.isGoogleUser,
                    email: email,
                    isMailVerified: user.isMailVerified
                };
                return [2 /*return*/, next()];
        }
    });
}); });
//signIn user with email and password
exports.userLogIn = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordValid;
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
                return [4 /*yield*/, (0, util_2.bcryptCompare)({ hashedPassword: user.password || "", password: password })];
            case 2:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Invalid Sign In details" })];
                }
                req.user = {
                    userId: user.id,
                    firstName: user.firstName || "", lastName: user.lastName || "",
                    isCredentialsSet: user.isCredentialsSet,
                    isGoogleUser: user.isGoogleUser,
                    email: email,
                    isMailVerified: user.isMailVerified
                };
                return [2 /*return*/, next()];
        }
    });
}); });
exports.reverifyToken = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var verifyToken, token, otpCode, otpObject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                verifyToken = req.cookies['MAILVERIFICATION'];
                return [4 /*yield*/, pris_client_1.default.verificationOTp.findFirst({
                        where: {
                            id: verifyToken, type: "MAILVERIFICATION"
                        },
                        include: {
                            user: true
                        }
                    })
                    //if token in cookie is not retrieving any result, it must have been malformed , user should relogin
                ];
            case 1:
                token = _a.sent();
                //if token in cookie is not retrieving any result, it must have been malformed , user should relogin
                if (!token) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Session Expired, RelogIn", code: 401 })];
                }
                //delete all associated token the user has
                return [4 /*yield*/, pris_client_1.default.verificationOTp.deleteMany({
                        where: {
                            userId: token.user.id, type: "MAILVERIFICATION"
                        }
                    })];
            case 2:
                //delete all associated token the user has
                _a.sent();
                otpCode = (0, util_1.generateOTP)();
                return [4 /*yield*/, pris_client_1.default.verificationOTp.create({
                        data: {
                            otpCode: otpCode,
                            userId: token.user.id,
                            expiredTime: (0, util_1.getTimeFromNow)(Number(process.env.OTP_EXPIRY_MINUTE)),
                            type: "MAILVERIFICATION"
                        }
                    })];
            case 3:
                otpObject = _a.sent();
                return [4 /*yield*/, (0, send_mail_1.mailSender)({ to: token.user.email, subject: "Utilor SignInOTp", body: otpObject.otpCode, name: "".concat(token.user.firstName, " ").concat(token.user.lastName) })
                    //set id to cookie
                ];
            case 4:
                _a.sent();
                //set id to cookie
                res.cookie("MAILVERIFICATION", otpObject.id, {
                    maxAge: 30 * 60 * 1000,
                    secure: true,
                    httpOnly: true,
                });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: { verifyToken: otpObject.id } })];
        }
    });
}); });
exports.verifyAndAddNewDevice = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var otpCode, identityToken, userObject, currentDate, deviceId, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                otpCode = req.body.otpCode;
                identityToken = req.cookies['identityToken'];
                return [4 /*yield*/, pris_client_1.default.verificationOTp.findFirst({
                        where: {
                            id: identityToken,
                            otpCode: otpCode,
                            type: "DEVICEVERIFCATION"
                        },
                        include: {
                            user: true
                        }
                    })];
            case 1:
                userObject = _a.sent();
                if (!userObject) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "OTP Supplied Invalid" })];
                }
                currentDate = new Date();
                if (currentDate > userObject.expiredTime) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "OTP supplied expired" })];
                }
                deviceId = (0, clientDevice_1.generateDeviceId)(req);
                user = userObject.user;
                return [4 /*yield*/, pris_client_1.default.userDevices.create({
                        data: {
                            userId: user.id,
                            device: deviceId
                        }
                    })
                    //delete all device OTp associated with user
                ];
            case 2:
                _a.sent();
                //delete all device OTp associated with user
                return [4 /*yield*/, pris_client_1.default.verificationOTp.deleteMany({
                        where: {
                            id: userObject.id, type: "DEVICEVERIFCATION"
                        }
                    })];
            case 3:
                //delete all device OTp associated with user
                _a.sent();
                res.clearCookie("identityToken");
                req.user = {
                    userId: user.id,
                    firstName: user.firstName || "", lastName: user.lastName || "",
                    isCredentialsSet: true,
                    isGoogleUser: user.isGoogleUser,
                    email: user.email,
                    isMailVerified: user.isMailVerified
                };
                return [2 /*return*/, next()];
        }
    });
}); });
exports.forgotPassword = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, otpCode, resetObject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: { email: email }
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Email is not recognized" })];
                }
                if (user.isGoogleUser) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Google users can not reset password" })];
                }
                otpCode = (0, util_1.generateOTP)();
                return [4 /*yield*/, pris_client_1.default.verificationOTp.create({
                        data: {
                            userId: user.id,
                            otpCode: otpCode,
                            expiredTime: (0, util_1.getTimeFromNow)(Number(process.env.OTP_EXPIRY_MINUTE)),
                            type: "RESETPASSWORD"
                        }
                    })];
            case 2:
                resetObject = _a.sent();
                return [4 /*yield*/, (0, send_mail_1.mailSender)({ to: email, subject: "Verify Email Adress", body: otpCode, name: "".concat(user.firstName, " ").concat(user.lastName) })
                    //set resetObjectId in response cookies
                ];
            case 3:
                _a.sent();
                //set resetObjectId in response cookies
                res.cookie("resetToken", resetObject.id, {
                    maxAge: 30 * 60 * 1000,
                    secure: true,
                    httpOnly: true,
                    // signed:true,
                });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Verification mail sent" })];
        }
    });
}); });
exports.resetPassword = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var verificationToken, _a, otpCode, password, resetObject, hashedPassword, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                verificationToken = req.cookies['resetToken'];
                _a = req.body, otpCode = _a.otpCode, password = _a.password;
                return [4 /*yield*/, pris_client_1.default.verificationOTp.findFirst({
                        where: {
                            id: verificationToken,
                            otpCode: otpCode
                        },
                        include: {
                            user: true
                        }
                    })];
            case 1:
                resetObject = _b.sent();
                if (!resetObject) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "OTP supplied invalid" })];
                }
                //prevent reset password of google users
                if (resetObject.user.isGoogleUser) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Google users can not reset password" })];
                }
                return [4 /*yield*/, (0, util_1.bcryptHash)(password)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, pris_client_1.default.user.update({
                        where: { id: resetObject.user.id },
                        data: {
                            password: hashedPassword
                        }
                    })];
            case 3:
                user = _b.sent();
                return [4 /*yield*/, pris_client_1.default.verificationOTp.deleteMany({
                        where: {
                            userId: resetObject.userId,
                            type: "RESETPASSWORD"
                        }
                    })];
            case 4:
                _b.sent();
                res.clearCookie("resetToken");
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: {
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
exports.googleSignUp = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var googleToken, userData, isExisting, hashedPassword, merchantID, newUser, deviceId, isAuthorized;
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
                            isMailVerified: true,
                            password: hashedPassword,
                            merchantID: merchantID
                        }
                    })
                    //create a new device ID tied to the user
                ];
            case 4:
                newUser = _a.sent();
                deviceId = (0, clientDevice_1.generateDeviceId)(req);
                return [4 /*yield*/, pris_client_1.default.userDevices.create({
                        data: {
                            userId: newUser.id,
                            device: deviceId
                        }
                    })
                    //set user response cookies
                ];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, credentials_setup_1.setAuthCredentials)({ req: req, res: res, id: newUser.id, email: newUser.email })];
            case 6:
                isAuthorized = _a.sent();
                if (!isAuthorized) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "verify device", code: 403 })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: {
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
//signIn with google
exports.googleSignIn = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var googleToken, userData, user, isAuthorized;
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
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Email does not exist " })];
                }
                if (!user.isGoogleUser) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Sign In with email and pasword" })];
                }
                return [4 /*yield*/, (0, credentials_setup_1.setAuthCredentials)({ req: req, res: res, id: user.id, email: user.email })];
            case 3:
                isAuthorized = _a.sent();
                if (!isAuthorized) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "verify device", code: 403 })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: {
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
