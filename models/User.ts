import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
  },
  { timestamps: true }
);

export type UserDoc = {
  _id: import("mongoose").Types.ObjectId;
  email: string;
  passwordHash: string;
  name?: string;
};

export const User = models.User || model("User", UserSchema);
