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
exports.depositIntoForUSaving = exports.channelWebHookData = void 0;
var pris_client_1 = __importDefault(require("../../prisma/pris-client"));
var util_1 = require("../../utils/util");
var channelWebHookData = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var eventType, dataFromWebhook, tx_ref, transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                // Send success message back to Flutterwave to prevent delay and resending of webhook notification;
                res.status(200).json({ message: "Webhook notification received" });
                eventType = req.body['event.type'] // 'event.type' is sent as a string in flutterWave's response
                ;
                dataFromWebhook = req.body;
                tx_ref = dataFromWebhook.data.tx_ref;
                return [4 /*yield*/, pris_client_1.default.transaction.findFirst({
                        where: { transactionReference: tx_ref }
                    })
                    // If none, just return
                ];
            case 1:
                transaction = _a.sent();
                // If none, just return
                if (!transaction) {
                    return [2 /*return*/];
                }
                // console.log("********************************");
                // console.log(transaction.description);
                // console.log("********************************");
                //? Now run different transactions depending on transaction type/description
                switch (transaction.description) {
                    case "FORU":
                        (0, exports.depositIntoForUSaving)(dataFromWebhook);
                        break;
                    default:
                        break;
                }
                return [2 /*return*/];
        }
    });
}); };
exports.channelWebHookData = channelWebHookData;
var depositIntoForUSaving = function (dataFromWebhook) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, tx_ref, status, correspondingUSaveForUTransaction, convertedAmount, uSaveForUAccount, dollarRate;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = dataFromWebhook.data, tx_ref = _a.tx_ref, status = _a.status;
                return [4 /*yield*/, pris_client_1.default.usaveForUTransaction.findFirst({
                        where: { transactionReference: tx_ref }
                    })];
            case 1:
                correspondingUSaveForUTransaction = _b.sent();
                // If no corresponding u-save/forU transaction not found, return
                if (!correspondingUSaveForUTransaction) {
                    return [2 /*return*/];
                }
                // If corresponding u-save/forU transaction found, but already updated, return
                if (correspondingUSaveForUTransaction.transactionStatus !== "PENDING") {
                    return [2 /*return*/];
                }
                if (!(status !== "successful")) return [3 /*break*/, 3];
                // If failed, update and return
                return [4 /*yield*/, pris_client_1.default.usaveForUTransaction.update({
                        where: { id: correspondingUSaveForUTransaction.id },
                        data: {
                            transactionStatus: "FAIL"
                        }
                    })];
            case 2:
                // If failed, update and return
                _b.sent();
                return [2 /*return*/];
            case 3: 
            //* Transaction status successful, uSaveForUTransaction not modified. We can safely deposit the money
            // Update USaveForUTransaction to be successful
            return [4 /*yield*/, pris_client_1.default.usaveForUTransaction.update({
                    where: {
                        id: correspondingUSaveForUTransaction.id
                    },
                    data: {
                        transactionStatus: "SUCCESS"
                    }
                })
                // Modify the USaveForUAccount as needed
            ];
            case 4:
                //* Transaction status successful, uSaveForUTransaction not modified. We can safely deposit the money
                // Update USaveForUTransaction to be successful
                _b.sent();
                convertedAmount = 0;
                return [4 /*yield*/, pris_client_1.default.uSaveForU.findFirst({
                        where: { id: correspondingUSaveForUTransaction.uSaveForUAccountId }
                    })];
            case 5:
                uSaveForUAccount = _b.sent();
                if ((uSaveForUAccount === null || uSaveForUAccount === void 0 ? void 0 : uSaveForUAccount.currency) === "USD") {
                    dollarRate = (0, util_1.getCurrentDollarRate)();
                    convertedAmount = correspondingUSaveForUTransaction.amount / dollarRate;
                }
                else {
                    convertedAmount = correspondingUSaveForUTransaction.amount;
                }
                return [4 /*yield*/, pris_client_1.default.uSaveForU.update({
                        where: { id: correspondingUSaveForUTransaction.uSaveForUAccountId },
                        data: {
                            investmentCapital: { increment: convertedAmount },
                            totalInvestment: { increment: convertedAmount }
                        }
                    })];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.depositIntoForUSaving = depositIntoForUSaving;
