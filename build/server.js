"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var app_1 = __importDefault(require("./app"));
var http_1 = __importDefault(require("http"));
dotenv_1.default.config();
var server = http_1.default.createServer(app_1.default);
var PORT = process.env.PORT || 5000;
var ENV_KEYS = [
    "DATABASE_URL",
    "PORT",
    "JWT_SECRET",
    "EMAIL_HOST",
    "EMAIL_USER",
    "EMAIL_PASSWORD",
    "EMAIL_SERVICE",
    "OTP_EXPIRY_MINUTE",
    "FLW_SECRET",
    "FLW_HASH",
    "AUDIENCE_ID",
    "MAIL_CHIP_KEY"
];
if (ENV_KEYS.some(function (k) { return !process.env[k]; })) {
    console.log("Server not started! 1 or more Environment Keys Missing");
}
else {
    try {
        server.listen(PORT, function () { return console.log("Server listening on port ".concat(PORT)); });
    }
    catch (e) {
        console.log('Cannot connect to the server');
    }
}
