"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDateFrequency = exports.getMidnightISODateTomorrow = exports.isGreaterThanDay = exports.getDifferenceInDays = void 0;
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
function getMidnightISODateTomorrow() {
    var tomorrow = new Date();
    var tomorrowAtDate = new Date(tomorrow.setDate(tomorrow.getDate() + 1)); // Add one day
    return tomorrowAtDate.toISOString();
}
exports.getMidnightISODateTomorrow = getMidnightISODateTomorrow;
//Add x amount of days to the date passed
function addDateFrequency(_a) {
    var date = _a.date, frequency = _a.frequency;
    var result = new Date(date);
    switch (frequency) {
        case 'DAILY':
            result.setDate(result.getDate() + 1);
            break;
        case 'WEEKLY':
            result.setDate(result.getDate() + 7);
            break;
        case 'BIMONTHLY':
            var daysInMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
            var bimonthlyDays = Math.ceil(daysInMonth / 2);
            result.setDate(result.getDate() + bimonthlyDays);
            break;
        case 'MONTHLY':
            result.setMonth(result.getMonth() + 1);
            break;
        case 'QUARTERLY':
            result.setMonth(result.getMonth() + 3);
            break;
        case 'BIYEARLY':
            result.setMonth(result.getMonth() + 6);
            break;
        case 'ANNUALLY':
            result.setFullYear(result.getFullYear() + 1);
            break;
        default:
            result.setDate(result.getDate());
    }
    return result;
}
exports.addDateFrequency = addDateFrequency;
