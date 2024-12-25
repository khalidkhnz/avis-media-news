"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = router;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./features/auth/auth.controller"));
const config_1 = __importDefault(require("./lib/config"));
function router() {
    const r = express_1.default.Router();
    r.get("/", (req, res) => {
        res.status(200).json({
            success: true,
            message: "welcome to api",
        });
    });
    r.post(`${config_1.default.API_VER_PREFIX}/register`, auth_controller_1.default.register);
    r.post(`${config_1.default.API_VER_PREFIX}/login`, auth_controller_1.default.login);
    r.get(`${config_1.default.API_VER_PREFIX}/current-user`, auth_controller_1.default.currentUser);
    r.get("*", (_, res) => {
        res.status(404).json({
            success: false,
            message: "No Resource Found",
        });
    });
    return r;
}
