export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  aiScore: number;
  status: "SUBMITTED" | "REVIEW" | "SHORTLIST" | "INTERVIEW" | "REJECTED";
  appliedDate: string;
  jobId: string;
  experience: string;
}
