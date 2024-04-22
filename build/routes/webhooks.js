"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyHook_1 = require("../controllers/hooks/verifyHook");
var hookController_1 = require("../controllers/hooks/hookController");
var hookRoutes = express_1.default.Router();
hookRoutes.route("/").post(verifyHook_1.verifyHook, hookController_1.channelWebHookData);
exports.default = hookRoutes;
