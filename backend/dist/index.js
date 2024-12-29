"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const http_1 = __importDefault(require("http"));
const routes_1 = require("./routes");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./lib/config"));
const cors_1 = __importDefault(require("cors"));
class Server {
    constructor() {
        const { app, server } = this.setupServer();
        this.setupMiddlewares(app);
        this.setupRoutes(app);
        this.listenAndServer(server);
    }
    setupServer() {
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        return { app, server };
    }
    connectToDB() {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield mongoose_1.default.connect(config_1.default.MONGO_URI);
            if (conn.connection.readyState === 1) {
                console.log("Connected To MONGO_DB");
            }
            else {
                console.log("DB Connection Failed");
            }
        });
    }
    setupMiddlewares(app) {
        app.use(express_1.default.json());
        app.use((0, hpp_1.default)());
        app.use((0, helmet_1.default)());
        app.use((0, cors_1.default)({
            allowedHeaders: ["Content-Type", "Authorization"],
            methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
            origin: "*",
        }));
    }
    setupRoutes(app) {
        app.use((0, routes_1.router)());
    }
    listenAndServer(server) {
        this.connectToDB();
        server.listen(4000, () => console.log("Server running on port 4000"));
    }
}
new Server();
