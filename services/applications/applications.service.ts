import { Application, ServiceResult } from "@/types";
import {
  findAllApplications,
  findApplicationById,
  saveNewApplication,
} from "@/repositories/applications.repository";
import { findJobById } from "@/repositories/jobs.repository";
import { ApplyToJobInput, applyToJobSchema } from "./applications.validation";
import { z } from "zod";

export async function applyToJob(
  input: ApplyToJobInput,
): Promise<ServiceResult<Application>> {
  const validated = applyToJobSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const job = await findJobById(validated.data.jobId);
  if (!job) {
    return {
      success: false,
      errors: { jobId: ["Job not found"] },
    };
  }

  // TODO: check if job is active or not

  // TODO: who is this candidate?

  // TODO: check if candidate already applied to this job

  const newApplication = await saveNewApplication({
    ...validated.data,
    candidateId: "69f21dc7e02f33189d6b08d8", // TODO: replace with actual candidate id
    jobTitle: job.title,
    role: job.title,
    jobCompany: job.company,
    aiScore: 0,
    status: "SUBMITTED",
  });
  return { success: true, data: newApplication };
}

export async function getApplications(): Promise<ServiceResult<Application[]>> {
  const applications = await findAllApplications();

  if (!applications) {
    return {
      success: false,
      errors: { applications: ["Applications not found"] },
    };
  }

  return { success: true, data: applications };
}

export async function getApplicationById(
  id: string,
): Promise<ServiceResult<Application>> {
  const application = await findApplicationById(id);

  if (!application) {
    return { success: false, errors: { id: ["Application not found"] } };
  }

  return { success: true, data: application as Application };
}
