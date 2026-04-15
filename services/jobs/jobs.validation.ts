import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Type is required"),
  salary: z.string().min(1, "Salary is required"),
  tags: z.array(z.string()).min(1, "Tags are required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.array(z.string().min(1, "Requirements are required")),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
