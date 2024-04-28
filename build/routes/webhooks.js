"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyHook_1 = require("../controllers/hooks/verifyHook");
var hookRoutes = express_1.default.Router();
hookRoutes.route("/").post(verifyHook_1.verifyHook);
exports.default = hookRoutes;
