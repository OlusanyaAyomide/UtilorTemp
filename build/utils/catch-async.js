"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var response_handler_1 = __importDefault(require("./response-handler"));
var util_1 = require("./util");
var catchDefaultAsync = function (handler) {
    return function (req, res, next) {
        Promise.resolve(handler(req, res, next)).catch(function (error) {
            console.error('Error caught in catchAsync:', error);
            response_handler_1.default.sendErrorResponse({ res: res, code: 500, error: (0, util_1.stringifyError)(error) });
        });
    };
};
exports.default = catchDefaultAsync;
