import { Application } from "@/types/Application";
import { Job } from "@/types/Job";
import { updateApplicationScreening } from "@/repositories/applications.repository";
import { analyzeApplicationResume } from "./openai-screening.service";

const SAFE_SCREENING_ERROR =
  "Screening could not be completed. The application was still submitted.";

type ScreeningInput = {
  application: Application;
  job: Job;
};

export async function screenApplication({ application, job }: ScreeningInput) {
  const processing = await updateApplicationScreening(application.id, {
    screeningStatus: "PROCESSING",
  });

  if (!processing) {
    throw new Error("Application was not found before screening");
  }

  try {
    const result = await analyzeApplicationResume({
      application: processing,
      job,
    });

    const completed = await updateApplicationScreening(application.id, {
      screeningStatus: "COMPLETED",
      aiScore: result.score,
      aiSummary: result.summary,
      aiStrengths: result.strengths,
      aiRisks: result.risks,
      screenedAt: new Date(),
    });

    if (!completed) {
      throw new Error("Application was not found after screening");
    }
  } catch (error) {
    await updateApplicationScreening(application.id, {
      screeningStatus: "FAILED",
      screeningError: SAFE_SCREENING_ERROR,
    });

    throw error;
  }
}
