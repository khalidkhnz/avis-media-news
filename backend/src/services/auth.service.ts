import bcrypt from "bcrypt";
import UserModel from "../features/auth/auth.schema";

class AuthService {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async findUserByEmail(email: string) {
    return UserModel.findOne({ email }).select("+password");
  }

  async findUserById(id: string) {
    return UserModel.findById(id).select("-password");
  }

  async createUser(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, email, password: hashedPassword });
    return user.save();
  }
}

const authService = new AuthService();
export default authService;
