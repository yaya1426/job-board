import { dbConnect } from "@/lib/db";
import { UserProfileModel } from "@/lib/models/user-profile.model";
import { UserProfile } from "@/types/UserProfile";

type UserProfileLean = Omit<UserProfile, "id" | "userId"> & {
  _id: { toString(): string };
  userId: { toString(): string };
  __v?: number;
};

function toUserProfile(doc: UserProfileLean): UserProfile {
  const { _id, __v, userId, ...rest } = doc;
  return {
    id: _id.toString(),
    userId: userId.toString(),
    ...rest,
  };
}

export async function findUserProfileByUserId(
  userId: string,
): Promise<UserProfile | null> {
  await dbConnect();
  const profile = await UserProfileModel.findOne({
    userId,
  }).lean<UserProfileLean>();
  return profile ? toUserProfile(profile) : null;
}

export async function saveUserProfile(
  profile: Omit<UserProfile, "id">,
): Promise<UserProfile> {
  await dbConnect();

  const saved = await UserProfileModel.findOneAndUpdate(
    { userId: profile.userId },
    profile,
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  ).lean<UserProfileLean>();

  if (!saved) {
    throw new Error("Failed to save user profile");
  }

  return toUserProfile(saved);
}
