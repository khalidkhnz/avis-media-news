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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_service_1 = __importDefault(require("../../services/auth.service"));
const config_1 = __importDefault(require("../../lib/config"));
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                if (!auth_service_1.default.isValidEmail(email)) {
                    res
                        .status(400)
                        .json({ success: false, message: "Invalid email format" });
                    return;
                }
                const existingUser = yield auth_service_1.default.findUserByEmail(email);
                if (existingUser) {
                    res
                        .status(400)
                        .json({ success: false, message: "Email already in use" });
                    return;
                }
                const user = yield auth_service_1.default.createUser(username, email, password);
                const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.default.JWT_SECRET, {
                    expiresIn: "7d",
                });
                res.status(201).json({
                    success: true,
                    message: "User registered successfully",
                    token,
                });
            }
            catch (error) {
                console.error("Registration error:", error);
                res.status(500).json({
                    success: false,
                    message: "Registration failed",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield auth_service_1.default.findUserByEmail(email);
                if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
                    res
                        .status(401)
                        .json({ success: false, message: "Invalid credentials" });
                    return;
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.default.JWT_SECRET, {
                    expiresIn: "7d",
                });
                res.status(200).json({
                    success: true,
                    message: "User logged in successfully",
                    token,
                });
            }
            catch (error) {
                console.error("Login error:", error);
                res.status(500).json({
                    success: false,
                    message: "Login failed",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
    currentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
                    res.status(401).json({ success: false, message: "No token provided" });
                    return;
                }
                const token = authHeader.split(" ")[1];
                const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
                const user = yield auth_service_1.default.findUserById(decoded.id);
                if (!user) {
                    res.status(404).json({ success: false, message: "User not found" });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "Current user fetched successfully",
                    user,
                });
            }
            catch (error) {
                console.error("Fetch user error:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch current user",
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
}
const authController = new AuthController();
exports.default = authController;
