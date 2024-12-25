import express, { Router } from "express";
import authController from "./features/auth/auth.controller";
import config from "./lib/config";
import postController from "./features/post/post.controller";
import authenticateToken from "./middlewares/authorization.middleware";

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

  r.post(
    `${config.API_VER_PREFIX}/posts`,
    authenticateToken as any,
    (req, res, next) => postController.create(req, res).catch(next)
  );
  r.put(
    `${config.API_VER_PREFIX}/posts/:id`,
    authenticateToken as any,
    (req, res, next) => postController.update(req, res).catch(next)
  );
  r.delete(
    `${config.API_VER_PREFIX}/posts/:id`,
    authenticateToken as any,
    (req, res, next) => postController.delete(req, res).catch(next)
  );

  r.get(`${config.API_VER_PREFIX}/posts/:id`, postController.get);
  r.get(`${config.API_VER_PREFIX}/posts`, postController.getAll);

  r.get("*", (_, res) => {
    res.status(404).json({
      success: false,
      message: "No Resource Found",
    });
  });
  return r;
}
