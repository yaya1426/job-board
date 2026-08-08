import { Application, ServiceResult } from "@/types";
import {
  findAllApplications,
  findApplicationByCandidateAndJob,
  findApplicationById,
  saveNewApplication,
} from "@/repositories/applications.repository";
import { findJobById } from "@/repositories/jobs.repository";
import { ApplyToJobInput, applyToJobSchema } from "./applications.validation";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { uploadResume } from "@/services/uploads/uploads.service";
import { screenApplication } from "../screening/screening.service";

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

  let resume;

  try {
    resume = await uploadResume(validated.data.resume);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: {
          resume: error.issues.map((issue) => issue.message),
        },
      };
    }

    return {
      success: false,
      errors: { resume: ["Failed to upload resume"] },
    };
  }

  // TODO: check if job is active or not

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      errors: { auth: ["You must be logged in to apply"] },
    };
  }

  // TODO: check if candidate already applied to this job

  const newApplication = await saveNewApplication({
    ...validated.data,
    candidateId: currentUser.id,
    candidateResumeKey: resume.key,
    candidateResumeFileName: resume.fileName,
    candidateResumeSize: resume.fileSize,
    candidateResumeContentType: resume.contentType,
    jobTitle: job.title,
    role: job.title,
    jobCompany: job.company,
    aiScore: 0, //TODO: Removed after AI screening is implemented
    screeningStatus: "PENDING",
    status: "SUBMITTED",
  });

  screenApplication({ application: newApplication, job });

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

export async function getCurrentUserApplicationForJob(
  jobId: string,
): Promise<ServiceResult<Application | null>> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      errors: { auth: ["You must be logged in"] },
    };
  }

  const application = await findApplicationByCandidateAndJob(
    currentUser.id,
    jobId,
  );

  if (!application) {
    return { success: false, errors: { jobId: ["Application not found"] } };
  }

  return { success: true, data: application as Application };
}
