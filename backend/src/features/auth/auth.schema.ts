import mongoose, { Schema } from "mongoose";
import { IUser } from "./auth.interface";

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("auths", UserSchema);
