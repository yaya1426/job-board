import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email().min(1, "Invalid email address"),
  linkedin: z.url().min(1, "Invalid LinkedIn URL"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm your password"),
});

export type SignupInput = z.infer<typeof signupSchema>;