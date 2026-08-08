import { z } from "zod";

export const applyToJobSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  candidateName: z.string().min(1, "Candidate Name is required"),
  candidateEmail: z.email().min(1, "Invalid email address"),
  candidateLinkedin: z.url().min(1, "Invalid LinkedIn URL"),
  candidateCoverLetter: z.string().min(1, "Candidate Cover Letter is required"),
  resume: z
    .instanceof(File, { error: "Resume is required" })
    .refine((file) => file.size > 0, "Resume is required"),
});

export type ApplyToJobInput = z.infer<typeof applyToJobSchema>;
