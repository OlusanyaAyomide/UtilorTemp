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
exports.stringifyError = exports.getWithdrawalInterest = exports.calculateSavingsPercentage = exports.calculateDailyReturns = exports.getCabalpercentage = exports.getUAndIPercentage = exports.getEmergencypercentage = exports.getForUPercentage = exports.getCurrentDollarRate = exports.generateTransactionRef = exports.convertToDate = exports.bcryptCompare = exports.bcryptHash = exports.getTimeFromNow = exports.generateMerchantID = exports.generateOTP = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
function generateOTP() {
    var otpLength = 4;
    var otp = '';
    for (var i = 0; i < otpLength; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
}
exports.generateOTP = generateOTP;
function generateMerchantID() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var id = '';
    while (id.length < 11) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        var char = characters.charAt(randomIndex);
        if (!id.includes(char)) {
            id += char;
        }
    }
    return id;
}
exports.generateMerchantID = generateMerchantID;
function getTimeFromNow(futureTime) {
    var timeFromNow = new Date();
    var dateTimeIn30Minutes = new Date(timeFromNow.getTime() + futureTime * 60000);
    return dateTimeIn30Minutes;
}
exports.getTimeFromNow = getTimeFromNow;
function bcryptHash(password) {
    return __awaiter(this, void 0, void 0, function () {
        var salt, hashed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
                case 1:
                    salt = _a.sent();
                    return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
                case 2:
                    hashed = _a.sent();
                    return [2 /*return*/, hashed];
            }
        });
    });
}
exports.bcryptHash = bcryptHash;
function bcryptCompare(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var isValid;
        var password = _b.password, hashedPassword = _b.hashedPassword;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, bcrypt_1.default.compare(password, hashedPassword || "")];
                case 1:
                    isValid = _c.sent();
                    return [2 /*return*/, isValid];
            }
        });
    });
}
exports.bcryptCompare = bcryptCompare;
function convertToDate(dateString) {
    var date = new Date(dateString);
    return date;
}
exports.convertToDate = convertToDate;
//this would be prefixed to the transaction ref, it would be used later from the webhook for find the resulting type of model to query
function generateTransactionRef(length) {
    var stringLength = length || 14;
    var id = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijlmnopqrstuvwxyz';
    while (id.length < stringLength) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        var char = characters.charAt(randomIndex);
        if (!id.includes(char)) {
            id += char;
        }
    }
    return id;
}
exports.generateTransactionRef = generateTransactionRef;
function getCurrentDollarRate() {
    // Todo: Implement receiving current rate from the db
    return 1200.00;
}
exports.getCurrentDollarRate = getCurrentDollarRate;
function getRandomNumberBetween(min, max) {
    if (min > max) {
        throw new Error('The min value must be less than or equal to the max value.');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var getForUPercentage = function () {
    return getRandomNumberBetween(9, 15);
};
exports.getForUPercentage = getForUPercentage;
var getEmergencypercentage = function () {
    return getRandomNumberBetween(12, 16);
};
exports.getEmergencypercentage = getEmergencypercentage;
var getUAndIPercentage = function () {
    return getRandomNumberBetween(13, 18);
};
exports.getUAndIPercentage = getUAndIPercentage;
var getCabalpercentage = function () {
    return getRandomNumberBetween(12, 15);
};
exports.getCabalpercentage = getCabalpercentage;
var calculateDailyReturns = function (_a) {
    var capital = _a.capital, interest = _a.interest;
    var dayPercent = ((interest / 100) / 365);
    return capital * dayPercent;
};
exports.calculateDailyReturns = calculateDailyReturns;
var calculateSavingsPercentage = function (_a) {
    var initial = _a.initial, currentTotal = _a.currentTotal, startDate = _a.startDate, endDate = _a.endDate;
    var startDateObject = new Date(startDate);
    var endDateObject = new Date(endDate);
    var yearsDifference = endDateObject.getFullYear() - startDateObject.getFullYear();
    var monthsDifference = endDateObject.getMonth() - startDateObject.getMonth();
    var duration = Math.abs((yearsDifference * 12) + monthsDifference);
    var expectedDuration = initial * duration;
    var completedPercentage = ((currentTotal / expectedDuration) * 100);
    var roundedPercentage = Math.round((completedPercentage + Number.EPSILON) * 100) / 100;
    return roundedPercentage;
};
exports.calculateSavingsPercentage = calculateSavingsPercentage;
var getWithdrawalInterest = function (_a) {
    var capital = _a.capital, amount = _a.amount, interest = _a.interest;
    var withdrawalPercentage = (amount / capital) * interest;
    return withdrawalPercentage;
};
exports.getWithdrawalInterest = getWithdrawalInterest;
function stringifyError(error) {
    if (error instanceof Error) {
        var errorObj = {
            message: error.message,
            name: error.name,
            stack: error.stack,
        };
        if ('cause' in error) {
            errorObj.cause = error.cause;
        }
        return JSON.stringify(errorObj, null, 2); // pretty-print with 2 spaces indentation
    }
    // Fallback for non-Error objects
    return JSON.stringify(error, null, 2);
}
exports.stringifyError = stringifyError;
