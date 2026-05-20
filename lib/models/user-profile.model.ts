import mongoose, { Schema } from "mongoose";

const userProfileSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    linkedin: {
      type: String,
      default: "",
    },
    resumeUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

export const UserProfileModel =
  mongoose.models.UserProfile ||
  mongoose.model("UserProfile", userProfileSchema);