import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

export type UserType = Document & {
  email: string;
  password: string;
  name: string;
  confirmed: boolean;
};

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    confirmed: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model<UserType>("User", UserSchema);

export default User;
