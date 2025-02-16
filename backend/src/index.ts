import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import helmet from "helmet";
import hpp from "hpp";
import http from "http";
import { router } from "./routes";
import mongoose from "mongoose";
import config from "./lib/config";
import cors from "cors";

type HttpServer = http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

class Server {
  constructor() {
    const { app, server } = this.setupServer();
    this.setupMiddlewares(app);
    this.setupRoutes(app);
    this.listenAndServer(server);
  }

  private setupServer() {
    const app: Application = express();
    const server: HttpServer = http.createServer(app);
    return { app, server };
  }

  private async connectToDB() {
    const conn = await mongoose.connect(config.MONGO_URI);
    if (conn.connection.readyState === 1) {
      console.log("Connected To MONGO_DB");
    } else {
      console.log("DB Connection Failed");
    }
  }

  private setupMiddlewares(app: Application) {
    app.use(express.json());
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
        origin: "*",
      })
    );
  }

  private setupRoutes(app: Application) {
    app.use(router());
  }

  private listenAndServer(server: HttpServer) {
    this.connectToDB();
    server.listen(config.PORT, () =>
      console.log("Server running on port 4000")
    );
  }
}

new Server();
