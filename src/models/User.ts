import { Document, Schema } from "mongoose";
import mongoose from "mongoose";
import { RoleType } from "./Role";

export type UserType = Document & {
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmed: boolean;
  roles: RoleType[];
};

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, required: true, default: false },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role", required: true }],
  },
  { timestamps: true }
);

const User = mongoose.model<UserType>("User", UserSchema);

export default User;
