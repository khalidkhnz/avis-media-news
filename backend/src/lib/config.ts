import dotenv from "dotenv";
import constant from "./constant";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const API_VER_PREFIX = process.env.API_VER_PREFIX || constant.API_VER_PREFIX;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/news";

export default {
  JWT_SECRET,
  API_VER_PREFIX,
  MONGO_URI,
  PORT: 4000,
};
