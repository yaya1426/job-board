"use server";

import { signup } from "@/services/auth/auth.service";
import { SignupInput } from "@/services/auth/auth.validation";

export type SignupState =
  | {
      errors?: Record<string, string[]>;
    }
  | undefined;

export async function handleSignup(formData: FormData): Promise<SignupState> {
  const raw = Object.fromEntries(formData);
  const data = raw as unknown as SignupInput;

  const result = await signup(data);

  if (!result.success) {
    return { errors: result.errors };
  }
}
