import { createContext, useContext } from "react";
import { Application, Job } from "@/types";

type ApplicationsContextType = {
  search: string;
  setSearch: (search: string) => void;
  statusFilter: string;
  setStatusFilter: (statusFilter: string) => void;
  jobFilter: string;
  setJobFilter: (jobFilter: string) => void;
  filteredApplications: Application[];
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  applications: Application[];
  setApplications: (applications: Application[]) => void;
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
  setJobs: () => {},
  applications: [],
  setApplications: () => {},
});

export const useApplications = () => {
  return useContext(ApplicationsContext);
};

export default ApplicationsContext;
