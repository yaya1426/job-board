import { Candidate, ServiceResult } from "@/types";
import { CandidateData } from "@/data/CandidateData";

export async function getCandidates(): Promise<ServiceResult<Candidate[]>> {
  // TODO: Database will solve this
  return { success: true, data: CandidateData };
}
