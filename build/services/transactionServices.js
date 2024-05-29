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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitialDates = void 0;
var util_1 = require("../utils/util");
function getInitialDates(duration) {
    var dates = [];
    var currentDate = new Date();
    for (var i = duration - 1; i >= 0; i--) {
        var pastDate = new Date(currentDate);
        pastDate.setDate(currentDate.getDate() - i);
        pastDate.setHours(2, 0, 0, 0); // Set time to 2:00 AM
        var formattedDate = pastDate.toISOString();
        dates.push({ date: formattedDate, interest: 0 });
    }
    return dates;
}
exports.getInitialDates = getInitialDates;
function calculateInterests(_a) {
    var transactions = _a.transactions, duration = _a.duration;
    var result = getInitialDates(duration);
    transactions.forEach(function (item) {
        var createdDate = new Date(item.createdAt);
        var today = new Date();
        var diffTime = Math.abs(today.getTime() - createdDate.getTime());
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log(diffDays);
        if (diffDays >= 0 && diffDays <= duration) {
            // console.log(diffDays,"Inside")
            console.log(diffDays, result[duration - diffDays]);
            var interestInNaira = item.transactionCurrency === "USD" ? item.amount * (0, util_1.getCurrentDollarRate)() : item.amount;
            console.log(interestInNaira, item.amount);
            var previousInterest = result[duration - diffDays].interest;
            result[duration - diffDays] = __assign(__assign({}, result[duration - diffDays]), { interest: previousInterest + interestInNaira });
        }
    });
    return result;
}
exports.default = calculateInterests;
