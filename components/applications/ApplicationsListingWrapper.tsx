"use client";
import ApplicationsProvider from "@/context/applications/ApplicationsProvider";
import ApplicationsFilter from "./ApplicationsFilter";
import ApplicationsStatusSummary from "./ApplicationsStatusSummary";
import ApplicationsTable from "./ApplicationsTable";
import { Job } from "@/types/Job";
import { Application, Candidate } from "@/types";

type Props = {
  jobs: Job[];
  applications: Application[];
  candidates: Candidate[];
};

function ApplicationsListingWrapper({ jobs, applications, candidates }: Props) {
  return (
    <ApplicationsProvider jobs={jobs} applications={applications} candidates={candidates}>
      <ApplicationsFilter />
      <ApplicationsStatusSummary />
      <ApplicationsTable />
    </ApplicationsProvider>
  );
}

export default ApplicationsListingWrapper;
