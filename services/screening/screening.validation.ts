import { z } from "zod";
import type { ScreeningResult } from "@/types";

export const screeningResultSchema: z.ZodType<ScreeningResult> = z.object({
  score: z.number().min(0).max(10),
  summary: z.string().min(1).max(1200),
  strengths: z.array(z.string().min(1)).max(5),
  risks: z.array(z.string().min(1)).max(5),
});
