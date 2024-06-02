"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGreaterThanDay = exports.getDifferenceInDays = void 0;
function getDifferenceInDays(startDate, endDate) {
    var date1 = new Date(startDate);
    var date2 = new Date(endDate);
    // Calculate the difference in milliseconds
    var differenceInMilliseconds = date2.getTime() - date1.getTime();
    // Convert the difference from milliseconds to days
    var differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return Math.abs(differenceInDays);
}
exports.getDifferenceInDays = getDifferenceInDays;
function isGreaterThanDay(date) {
    var givenDate = new Date(date);
    var currentDate = new Date();
    var differenceInMilliseconds = givenDate.getTime() - currentDate.getTime();
    var differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return differenceInDays < 0;
}
exports.isGreaterThanDay = isGreaterThanDay;
