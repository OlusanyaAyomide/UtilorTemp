"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
// Intercepting all axios request and adding secret key to headers if it exists
var onRequest = function (config) {
    var method = config.method, url = config.url;
    config.headers["Authorization"] = process.env.FLW_SECRET;
    return config;
};
var onResponse = function (response) {
    return response;
};
var onErrorResponse = function (error) {
    var _a;
    if (axios_1.default.isAxiosError(error)) {
        var status = ((_a = error.response) !== null && _a !== void 0 ? _a : {}).status;
    }
    return Promise.reject(error);
};
var baseURL = "https://api.flutterwave.com/v3";
var request = axios_1.default.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json"
    }
});
request.interceptors.request.use(onRequest, onErrorResponse);
request.interceptors.response.use(onResponse, onErrorResponse);
exports.default = request;
