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
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_schema_1 = __importDefault(require("../features/auth/auth.schema"));
class AuthService {
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return auth_schema_1.default.findOne({ email }).select("+password");
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return auth_schema_1.default.findById(id).select("-password");
        });
    }
    createUser(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = new auth_schema_1.default({ username, email, password: hashedPassword });
            return user.save();
        });
    }
}
const authService = new AuthService();
exports.default = authService;
