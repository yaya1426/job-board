import { createContext, useContext } from "react";
import { Application, Candidate, Job } from "@/types";

type ApplicationsContextType = {
  search: string;
  setSearch: (search: string) => void;
  statusFilter: string;
  setStatusFilter: (statusFilter: string) => void;
  jobFilter: string;
  setJobFilter: (jobFilter: string) => void;
  filteredApplications: Application[];
  jobs: Job[];
  applications: Application[];
  candidates: Candidate[];
};

const ApplicationsContext = createContext<ApplicationsContextType>({
  search: "",
  setSearch: () => {},
  statusFilter: "ALL",
  setStatusFilter: () => {},
  jobFilter: "ALL",
  setJobFilter: () => {},
  filteredApplications: [],
  jobs: [],
  applications: [],
  candidates: [],
});

export const useApplications = () => {
  return useContext(ApplicationsContext);
};

export default ApplicationsContext;
