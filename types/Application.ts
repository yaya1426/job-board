export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  role: string;
  aiScore: number;
  status: "SUBMITTED" | "REVIEW" | "SHORTLIST" | "INTERVIEW" | "REJECTED";
  appliedDate: string;
  coverLetter?: string;
}
