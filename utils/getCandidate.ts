import { Candidate } from "@/types";

// Helper to get candidate by ID
export function getCandidate(
  id: string,
  candidates: Candidate[],
): Candidate | undefined {
  return candidates.find((c) => c.id === id);
}
