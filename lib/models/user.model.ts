import mongoose, { Schema } from "mongoose";
import { ROLES } from "@/types/Roles";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
      default: "CANDIDATE",
    },
  },
  { timestamps: true },
    );

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);