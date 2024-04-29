"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getAllUserUAndI = exports.getSingleForU = exports.getAllUserForU = void 0;
var response_handler_1 = __importDefault(require("../../utils/response-handler"));
var catch_async_1 = __importDefault(require("../../utils/catch-async"));
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
exports.getAllUserForU = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, allForU;
    var _a;
    return __generator(this, function (_b) {
        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
        }
        allForU = pris_client_1.default.uSaveForU.findMany({
            where: { userId: userId },
        });
        return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: allForU })];
    });
}); });
exports.getSingleForU = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var detail, singleForU, transactions, data;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                detail = req.params.id;
                if (!detail) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Id is required" })];
                }
                return [4 /*yield*/, pris_client_1.default.uSaveForU.findFirst({
                        where: { id: detail }
                    })];
            case 1:
                singleForU = _b.sent();
                if (!singleForU) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "For U Id is invalid" })];
                }
                if (singleForU.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Not permitted to view this savings" })];
                }
                return [4 /*yield*/, pris_client_1.default.transaction.findMany({
                        where: {
                            featureId: singleForU.id
                        }
                    })];
            case 2:
                transactions = _b.sent();
                data = __assign(__assign({}, singleForU), { transactions: transactions });
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: data })];
        }
    });
}); });
//get all UandI where the user is either the creator or the partner
exports.getAllUserUAndI = (0, catch_async_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, allUAndI;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                return [4 /*yield*/, pris_client_1.default.uANDI.findMany({
                        where: {
                            OR: [
                                {
                                    creatorId: userId
                                },
                                {
                                    partnerId: userId
                                }
                            ]
                        },
                        orderBy: {
                            totalCapital: "desc"
                        }
                    })];
            case 1:
                allUAndI = _b.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: allUAndI })];
        }
    });
}); });