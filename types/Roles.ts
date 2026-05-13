export const ROLES = ["CANDIDATE", "ADMIN"] as const;

export type Role = (typeof ROLES)[number];