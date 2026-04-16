import { useState } from "react";
import JobsContext from "./UsersContext";
import { Application, Job, Candidate } from "@/types";

type Props = {
  jobs: Job[];
  applications: Application[];
  candidates: Candidate[];
  children: React.ReactNode;
};

const UsersProvider = ({ jobs = [], applications = [], candidates = [], children }: Props) => {
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [candidatesState] = useState<Candidate[]>(candidates);
  const [jobState] = useState<Job[]>(jobs);
  const [applicationsState] = useState<Application[]>(applications);
  const filteredCandidates = candidatesState.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const avgScore =
    applicationsState.length > 0
      ? Math.round(
          (applicationsState.reduce((s, a) => s + a.aiScore, 0) /
            applicationsState.length) *
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
        jobs: jobState,
        applications: applicationsState,
        filteredCandidates,
        avgScore,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export default UsersProvider;
