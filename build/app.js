"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var authRoutes_1 = __importDefault(require("./routes/authRoutes"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var savingsRoutes_1 = __importDefault(require("./routes/savingsRoutes"));
var webhooks_1 = __importDefault(require("./routes/webhooks"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/user', authRoutes_1.default);
app.use('/savings', savingsRoutes_1.default);
app.use('/hooks', webhooks_1.default);
app.all('*', function (req, res) {
    return res.status(404).json({ message: 'Route not found' });
});
exports.default = app;
