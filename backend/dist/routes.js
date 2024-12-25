"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = router;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./features/auth/auth.controller"));
const config_1 = __importDefault(require("./lib/config"));
const post_controller_1 = __importDefault(require("./features/post/post.controller"));
const authorization_middleware_1 = __importDefault(require("./middlewares/authorization.middleware"));
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
    r.post(`${config_1.default.API_VER_PREFIX}/posts`, authorization_middleware_1.default, (req, res, next) => post_controller_1.default.create(req, res).catch(next));
    r.put(`${config_1.default.API_VER_PREFIX}/posts/:id`, authorization_middleware_1.default, (req, res, next) => post_controller_1.default.update(req, res).catch(next));
    r.delete(`${config_1.default.API_VER_PREFIX}/posts/:id`, authorization_middleware_1.default, (req, res, next) => post_controller_1.default.delete(req, res).catch(next));
    r.get(`${config_1.default.API_VER_PREFIX}/posts/:id`, post_controller_1.default.get);
    r.get(`${config_1.default.API_VER_PREFIX}/posts`, post_controller_1.default.getAll);
    r.get("*", (_, res) => {
        res.status(404).json({
            success: false,
            message: "No Resource Found",
        });
    });
    return r;
}
