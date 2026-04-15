import { createJobSchema, CreateJobInput } from "./jobs.validation";
import { Job } from "@/types/Job";
import { z } from "zod";

type ServiceResult<T> =
  | { success: true; data?: T }
  | { success: false; errors?: Record<string, string[]> };

export async function createJob(
  input: CreateJobInput,
): Promise<ServiceResult<Job>> {
  const validated = createJobSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  console.log("Creating job", validated);
  // TODO: Database will solve this type
  return { success: true, data: validated.data as Job };
}
