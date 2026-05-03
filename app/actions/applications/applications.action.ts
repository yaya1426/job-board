"use server";

import { applyToJob } from "@/services/applications/applications.service";
import { ApplyToJobInput } from "@/services/applications/applications.validation";

export type ApplyToJobState =
  | {
      errors?: Record<string, string[]>;
    }
  | undefined;

export async function handleApplyToJob(
  prevState: ApplyToJobState,
  formData: FormData,
): Promise<ApplyToJobState> {
  const raw = Object.fromEntries(formData);

  const data = {
    ...(raw as unknown as ApplyToJobInput),
  };

  const result = await applyToJob(data);

  if (!result.success) {
    return { errors: result.errors };
  }
}
