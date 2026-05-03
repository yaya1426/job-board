export interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateLinkedin: string;
  candidateCoverLetter: string;
  jobId: string;
  jobTitle: string;
  jobCompany: string;
  role: string;
  aiScore: number;
  status: "SUBMITTED" | "REVIEW" | "SHORTLIST" | "INTERVIEW" | "REJECTED";
  appliedDate: string;
  coverLetter?: string;
}
