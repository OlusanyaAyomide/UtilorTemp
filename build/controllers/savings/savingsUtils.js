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
exports.addPromoCodeToUAndI = exports.addPromoCodeToEmergency = exports.addPromoCodeToUsave = exports.startCabalGroup = exports.JoinMyCabal = exports.sendMyCabalInvitation = void 0;
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var catch_async_1 = __importDefault(require("../../utils/catch-async"));
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
var send_mail_1 = require("../../utils/send-mail");
exports.sendMyCabalInvitation = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, cabalData, cabal, userDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                cabalData = req.body;
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.cabalGroup.findUnique({
                        where: { id: cabalData.cabalId }
                    })
                    //verify cabal exisst
                ];
            case 1:
                cabal = _a.sent();
                //verify cabal exisst
                if (!cabal) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Cabal was not found" })];
                }
                //verify user is admin
                if (cabal.cabalAdminId !== user.userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Only Admin can send invitation link" })];
                }
                return [4 /*yield*/, pris_client_1.default.user.findFirst({ where: {
                            merchantID: cabalData.merchantId
                        } })];
            case 2:
                userDetails = _a.sent();
                if (!userDetails) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "MerchantId is not valid" })];
                }
                //send invitation link to usr
                return [4 /*yield*/, (0, send_mail_1.mailSender)({ to: userDetails.email, subject: "".concat(cabal.groupName, " Invitation"), body: "Invitation To join ".concat(cabal.groupName, "  Cabal Id : ").concat(cabal.id), name: userDetails.firstName || "" })];
            case 3:
                //send invitation link to usr
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Invitaion sent to ".concat(userDetails.firstName, " ").concat(userDetails.lastName) })];
        }
    });
}); });
exports.JoinMyCabal = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, cabalId, cabalGroup, isAlreadyInGroup, updatedCabal, allUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                cabalId = req.params.id;
                return [4 /*yield*/, pris_client_1.default.cabalGroup.findFirst({
                        where: {
                            id: cabalId
                        }
                    })];
            case 1:
                cabalGroup = _a.sent();
                if (!cabalGroup) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Cabal Id is Invalid" })];
                }
                return [4 /*yield*/, pris_client_1.default.userCabal.findFirst({
                        where: {
                            cabalGroupId: cabalGroup === null || cabalGroup === void 0 ? void 0 : cabalGroup.id,
                            userId: user.userId
                        }
                    })];
            case 2:
                isAlreadyInGroup = _a.sent();
                if (isAlreadyInGroup) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Already a member of this group" })];
                }
                return [4 /*yield*/, pris_client_1.default.cabalGroup.update({
                        where: { id: cabalGroup === null || cabalGroup === void 0 ? void 0 : cabalGroup.id },
                        data: {
                            userCabals: {
                                create: {
                                    userId: user.userId
                                }
                            }
                        }
                    })
                    //create notifications for all cabal users
                ];
            case 3:
                updatedCabal = _a.sent();
                return [4 /*yield*/, pris_client_1.default.userCabal.findMany({
                        where: { cabalGroupId: cabalGroup === null || cabalGroup === void 0 ? void 0 : cabalGroup.id }
                    })
                    //create a dashboard notification for all user in cabal
                ];
            case 4:
                allUsers = _a.sent();
                //create a dashboard notification for all user in cabal
                return [4 /*yield*/, pris_client_1.default.notification.createMany({
                        data: allUsers.map(function (item) {
                            var _a, _b;
                            return { userId: item.userId, description: "".concat((_a = req.user) === null || _a === void 0 ? void 0 : _a.firstName, " ").concat((_b = req.user) === null || _b === void 0 ? void 0 : _b.lastName, " has joined ").concat(updatedCabal.groupName) };
                        })
                    })];
            case 5:
                //create a dashboard notification for all user in cabal
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Succesfully Joined Cabal ".concat(updatedCabal.groupName) })];
        }
    });
}); });
exports.startCabalGroup = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var cabalId, cabalGroup, updatedCabal;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cabalId = req.body.cabalId;
                return [4 /*yield*/, pris_client_1.default.cabalGroup.findFirst({
                        where: { id: cabalId }
                    })];
            case 1:
                cabalGroup = _b.sent();
                if (!cabalGroup) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Cabal Id is invalid" })];
                }
                if (cabalGroup.cabalAdminId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Only Cabal Admins can start a cabal" })];
                }
                return [4 /*yield*/, pris_client_1.default.cabalGroup.update({
                        where: { id: cabalGroup.id },
                        data: { hasStarted: true },
                    })];
            case 2:
                updatedCabal = _b.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "".concat(updatedCabal.groupName, " has now started") })];
        }
    });
}); });
exports.addPromoCodeToUsave = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bodyData, foru, promoCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bodyData = req.body;
                return [4 /*yield*/, pris_client_1.default.uSaveForU.findFirst({
                        where: {
                            id: bodyData.savingsId
                        }
                    })];
            case 1:
                foru = _a.sent();
                if (!foru) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Savings Id is invalid" })];
                }
                return [4 /*yield*/, pris_client_1.default.promoCodes.findFirst({
                        where: {
                            name: bodyData.promoCode,
                            product: "FORU",
                            //expiry will be added later but has been skipped for development purposes
                        }
                    })];
            case 2:
                promoCode = _a.sent();
                if (!promoCode) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Promo Code invalid or has expired" })];
                }
                //create new connection between usave and promoCode
                return [4 /*yield*/, pris_client_1.default.uSaveForUPromoCode.create({
                        data: {
                            usaveForUId: foru.id,
                            promoCodeId: promoCode.id
                        }
                    })];
            case 3:
                //create new connection between usave and promoCode
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Promo Code has been added to U savings" })];
        }
    });
}); });
exports.addPromoCodeToEmergency = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bodyData, emergency, promoCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bodyData = req.body;
                return [4 /*yield*/, pris_client_1.default.emergency.findFirst({
                        where: {
                            id: bodyData.savingsId
                        }
                    })];
            case 1:
                emergency = _a.sent();
                if (!emergency) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Savings Id is invalid" })];
                }
                return [4 /*yield*/, pris_client_1.default.promoCodes.findFirst({
                        where: {
                            name: bodyData.promoCode,
                            product: "EMERGENCY",
                            //expiry will be added later but has been skipped for development purposes
                        }
                    })];
            case 2:
                promoCode = _a.sent();
                if (!promoCode) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Promo Code invalid or has expired" })];
                }
                //create new connection between emergency and promoCode
                return [4 /*yield*/, pris_client_1.default.uSaveForUPromoCode.create({
                        data: {
                            usaveForUId: emergency.id,
                            promoCodeId: promoCode.id
                        }
                    })];
            case 3:
                //create new connection between emergency and promoCode
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Promo Code has been addeed to Emergency savings" })];
        }
    });
}); });
exports.addPromoCodeToUAndI = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bodyData, uandi, promoCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bodyData = req.body;
                return [4 /*yield*/, pris_client_1.default.uANDI.findFirst({
                        where: {
                            id: bodyData.savingsId
                        }
                    })];
            case 1:
                uandi = _a.sent();
                if (!uandi) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Savings Id is invalid" })];
                }
                return [4 /*yield*/, pris_client_1.default.promoCodes.findFirst({
                        where: {
                            name: bodyData.promoCode,
                            product: "UANDI",
                            //expiry will be added later but has been skipped for development purposes
                        }
                    })];
            case 2:
                promoCode = _a.sent();
                if (!promoCode) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Promo Code invalid or has expired" })];
                }
                //create new connection between uAndi and promoCode
                return [4 /*yield*/, pris_client_1.default.uSaveForUPromoCode.create({
                        data: {
                            usaveForUId: uandi.id,
                            promoCodeId: promoCode.id
                        }
                    })];
            case 3:
                //create new connection between uAndi and promoCode
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Promo Code has been added to UAndI savings" })];
        }
    });
}); });
