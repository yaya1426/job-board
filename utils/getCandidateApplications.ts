import { Application } from "@/types";

export function getCandidateApplications(candidateId: string, applications: Application[]): Application[] {
  return applications.filter((a) => a.candidateId === candidateId);
}
