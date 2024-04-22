"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDeviceId = void 0;
var node_device_detector_1 = __importDefault(require("node-device-detector"));
var crypto_1 = __importDefault(require("crypto"));
var generateDeviceId = function (req) {
    var userAgent = req.headers["user-agent"] || "";
    //gets device objects
    var detector = new node_device_detector_1.default({
        clientIndexes: true,
        deviceIndexes: true,
        deviceAliasCode: false,
        deviceTrusted: false,
        deviceInfo: false,
        maxUserAgentSize: 500,
    });
    var device = detector.detect(userAgent);
    console.log(device);
    //device object is used to generate a crypto Id
    var deviceString = JSON.stringify(device);
    var hash = crypto_1.default.createHash('sha256').update(deviceString).digest("hex");
    console.log(hash);
    return hash;
};
exports.generateDeviceId = generateDeviceId;
