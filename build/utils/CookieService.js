"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = void 0;
var setCookie = function (_a) {
    var name = _a.name, value = _a.value, _b = _a.duration, duration = _b === void 0 ? 30 : _b, res = _a.res;
    var currentTime = new Date();
    var futureTime = new Date(currentTime.getTime() + (duration * 60000));
    var isProd = process.env.APP_ENV !== "DEV";
    res.cookie(name, value, {
        maxAge: duration * 60 * 1000,
        secure: isProd,
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        // expires:futureTime,
        partitioned: isProd,
    });
};
exports.setCookie = setCookie;
