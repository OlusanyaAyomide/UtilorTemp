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
var ResponseHandler = /** @class */ (function () {
    function ResponseHandler() {
    }
    // Success Response Handler
    ResponseHandler.sendSuccessResponse = function (_a) {
        var res = _a.res, _b = _a.code, code = _b === void 0 ? 200 : _b, _c = _a.message, message = _c === void 0 ? 'Operation Successful' : _c, _d = _a.data, data = _d === void 0 ? null : _d, _e = _a.custom, custom = _e === void 0 ? false : _e;
        var response = custom && data ? __assign({}, data) : { success: true, code: code, message: message, data: data };
        return res.status(code).json(response);
    };
    // Error Response Handler
    ResponseHandler.sendErrorResponse = function (_a) {
        var res = _a.res, _b = _a.code, code = _b === void 0 ? 400 : _b, _c = _a.status_code, status_code = _c === void 0 ? "BAD_REQUEST" : _c, _d = _a.error, error = _d === void 0 ? 'Operation failed' : _d, _e = _a.custom, custom = _e === void 0 ? false : _e, _f = _a.data, data = _f === void 0 ? null : _f;
        var response = custom ? { code: code, status_code: status_code, message: error, data: data } : { success: false, code: code, message: error, status_code: status_code, data: data };
        return res.status(code).json(response);
    };
    ResponseHandler.sendUnauthorizedResponse = function (_a) {
        var res = _a.res, _b = _a.code, code = _b === void 0 ? 403 : _b, _c = _a.error, error = _c === void 0 ? 'Unauthorized Response' : _c, _d = _a.custom, custom = _d === void 0 ? false : _d;
        var response = custom ? { code: code, message: error } : { success: false, code: code, message: error };
        return res.status(code).json(response);
    };
    return ResponseHandler;
}());
exports.default = ResponseHandler;
