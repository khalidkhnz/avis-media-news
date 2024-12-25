import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import authService from "../../services/auth.service";
import config from "../../lib/config";

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      if (!authService.isValidEmail(email)) {
        res
          .status(400)
          .json({ success: false, message: "Invalid email format" });
        return;
      }

      const existingUser = await authService.findUserByEmail(email);
      if (existingUser) {
        res
          .status(400)
          .json({ success: false, message: "Email already in use" });
        return;
      }

      const user = await authService.createUser(username, email, password);
      const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await authService.findUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async currentUser(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ success: false, message: "No token provided" });
        return;
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
      const user = await authService.findUserById(decoded.id);

      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Current user fetched successfully",
        user,
      });
    } catch (error) {
      console.error("Fetch user error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch current user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

const authController = new AuthController();
export default authController;
