import { ScreeningStatus } from "./ScreeningStatus";

export interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateLinkedin: string;
  candidateCoverLetter: string;
  candidateResumeKey?: string;
  candidateResumeFileName?: string;
  candidateResumeSize?: number;
  candidateResumeContentType?: string;
  jobId: string;
  jobTitle: string;
  jobCompany: string;
  role: string;
  aiScore?: number;
  aiSummary?: string;
  aiStrengths?: string[];
  aiRisks?: string[];
  screeningError?: string;
  screeningStatus: ScreeningStatus;
  screenedAt?: string;
  status: "SUBMITTED" | "REVIEW" | "SHORTLIST" | "INTERVIEW" | "REJECTED";
  appliedDate: string;
  coverLetter?: string;
}
