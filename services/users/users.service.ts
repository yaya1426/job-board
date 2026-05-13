import { getCurrentUser } from "@/lib/current-user";
import { findUserProfileByUserId } from "@/repositories/user-profiles.repository";
import { UserProfile } from "@/types/UserProfile";
import { User } from "@/types/User";
import { ServiceResult } from "@/types/ServiceResult";

export async function getCurrentUserProfile(): Promise<
  ServiceResult<(UserProfile & User) | null>
> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      errors: { auth: ["You must be logged in"] },
    };
  }

  const profile = await findUserProfileByUserId(currentUser.id);

  if (!profile) {
    return {
      success: false,
      errors: { profile: ["Profile not found"] },
    };
  }

  return {
    success: true,
    data: { ...currentUser, ...profile },
  };
}
