import { createContext, useContext } from "react";
import { Application, Candidate, Job } from "@/types";

type UsersContextType = {
  search: string;
  setSearch: (search: string) => void;
  expandedUser: string | null;
  setExpandedUser: (user: string | null) => void;
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  applications: Application[];
  setApplications: (applications: Application[]) => void;
  filteredCandidates: Candidate[];
  avgScore: number;
};

const UsersContext = createContext<UsersContextType>({
  search: "",
  setSearch: () => {},
  expandedUser: null,
  setExpandedUser: () => {},
  candidates: [],
  setCandidates: () => {},
  jobs: [],
  setJobs: () => {},
  applications: [],
  setApplications: () => {},
  filteredCandidates: [],
  avgScore: 0,
});

export const useUsers = () => {
  return useContext(UsersContext);
};

export default UsersContext;
