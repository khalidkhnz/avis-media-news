import express, { Router } from "express";
import authController from "./features/auth/auth.controller";
import config from "./lib/config";

export function router(): Router {
  const r = express.Router();

  r.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "welcome to api",
    });
  });

  r.post(`${config.API_VER_PREFIX}/register`, authController.register);
  r.post(`${config.API_VER_PREFIX}/login`, authController.login);
  r.get(`${config.API_VER_PREFIX}/current-user`, authController.currentUser);

  r.get("*", (_, res) => {
    res.status(404).json({
      success: false,
      message: "No Resource Found",
    });
  });
  return r;
}
