"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const constant_1 = __importDefault(require("./constant"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const API_VER_PREFIX = process.env.API_VER_PREFIX || constant_1.default.API_VER_PREFIX;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/news";
exports.default = {
    JWT_SECRET,
    API_VER_PREFIX,
    MONGO_URI,
    PORT: 4000,
};
