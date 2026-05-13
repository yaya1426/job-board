import { z } from "zod";
import { ServiceResult, User } from "@/types";
import { signupSchema, SignupInput } from "./auth.validation";
import {
  findUserByEmail,
  findUserByEmailWithPassword,
  saveNewUser,
} from "@/repositories/users.repository";
import { hashPassword, verifyPassword } from "@/lib/password";
import { saveUserProfile } from "@/repositories/user-profiles.repository";

export async function signup(input: SignupInput): Promise<ServiceResult<User>> {
  const validated = signupSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const { name, email, password, linkedin, confirmPassword } = validated.data;

  if (password !== confirmPassword) {
    return {
      success: false,
      errors: { confirmPassword: ["Passwords do not match"] },
    };
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return {
      success: false,
      errors: { email: ["Invalid email address"] },
    };
  }

  const passwordHash = await hashPassword(password);

  const user = await saveNewUser({
    name,
    email,
    role: "CANDIDATE",
    passwordHash,
  });

  await saveUserProfile({
    userId: user.id,
    linkedin,
  });

  return { success: true, data: user };
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<User | null> {
  const user = await findUserByEmailWithPassword(email);
  if (!user) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
