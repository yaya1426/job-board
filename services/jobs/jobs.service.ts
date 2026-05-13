import { createJobSchema, CreateJobInput } from "./jobs.validation";
import { Job } from "@/types/Job";
import { z } from "zod";
import { ServiceResult } from "@/types";
import {
  findAllJobs,
  findJobById,
  saveNewJob,
} from "@/repositories/jobs.repository";
import { getCurrentUser } from "@/lib/current-user";

export async function createJob(
  input: CreateJobInput,
): Promise<ServiceResult<Job>> {
  const validated = createJobSchema.safeParse(input);

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return {
      success: false,
      errors: {
        auth: ["You are not allowed to create jobs"],
      },
    };
  }

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const newJob = await saveNewJob(validated.data);
  return { success: true, data: newJob };
}

export async function getJobs(): Promise<ServiceResult<Job[]>> {
  const jobs = await findAllJobs();

  if (!jobs) {
    return { success: false, errors: { jobs: ["Jobs not found"] } };
  }

  return { success: true, data: jobs };
}

export async function getJob(id: string): Promise<ServiceResult<Job>> {
  const job = await findJobById(id);

  if (!job) {
    return { success: false, errors: { id: ["Job not found"] } };
  }
  return { success: true, data: job as Job };
}
