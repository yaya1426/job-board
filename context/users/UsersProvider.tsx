import { useState } from "react";
import JobsContext from "./UsersContext";
import { ApplicationsData } from "@/data/ApplicationsData";
import { CandidateData } from "@/data/CandidateData";
import { Application, Job, Candidate } from "@/types";
import { JobsData } from "@/data/JobsData";

const UsersProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>(CandidateData);
  const [jobs, setJobs] = useState<Job[]>(JobsData);
  const [applications, setApplications] =
    useState<Application[]>(ApplicationsData);
  const filteredCandidates = candidates.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const avgScore =
    applications.length > 0
      ? Math.round(
          (applications.reduce((s, a) => s + a.aiScore, 0) /
            applications.length) *
            10,
        ) / 10
      : 0;

  return (
    <JobsContext.Provider
      value={{
        search,
        setSearch,
        expandedUser,
        setExpandedUser,
        candidates,
        setCandidates,
        jobs,
        setJobs,
        applications,
        setApplications,
        filteredCandidates,
        avgScore,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export default UsersProvider;
