"use server";

import { createJob } from "@/services/jobs/jobs.service";
import { CreateJobInput } from "@/services/jobs/jobs.validation";
import { revalidatePath } from "next/cache";

export type CreateJobState = {
  errors?: Record<string, string[]>;
} | undefined;

export async function handleCreateJob(
  prevState: CreateJobState,
  formData: FormData,
): Promise<CreateJobState> {
  const raw = Object.fromEntries(formData);

  const data = {
    ...(raw as unknown as CreateJobInput),
    tags: (raw.tags as string).split(","),
    requirements: (raw.requirements as string).split("\n"),
  };

  const result = await createJob(data);

  if (!result.success) {
    return { errors: result.errors };
  }

  revalidatePath("/dashboard/jobs", "layout");
}
