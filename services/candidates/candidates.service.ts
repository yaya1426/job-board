import { Candidate, ServiceResult } from "@/types";
import { CandidateData } from "@/data/CandidateData";
import { dbConnect } from "@/lib/db";

export async function getCandidates(): Promise<ServiceResult<Candidate[]>> {
  await dbConnect();
  // TODO: Database will solve this
  return { success: true, data: CandidateData };
}
