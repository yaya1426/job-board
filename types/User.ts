import type { Role } from "./Roles";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}