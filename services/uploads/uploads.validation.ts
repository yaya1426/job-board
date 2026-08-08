import { z } from "zod";

export const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB
export const PDF_CONTENT_TYPE = "application/pdf";

export const resumeUploadRequestSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileSize: z
    .number()
    .int()
    .positive()
    .max(MAX_RESUME_SIZE, "Resume must be 5MB or smaller"),
  contentType: z.literal(PDF_CONTENT_TYPE, {
    error: "Resume must be a PDF file",
  }),
});

export type ResumeUploadRequest = z.infer<typeof resumeUploadRequestSchema>;