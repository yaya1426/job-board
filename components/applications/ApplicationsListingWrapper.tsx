"use client";
import ApplicationsProvider from "@/context/applications/ApplicationsProvider";
import ApplicationsFilter from "./ApplicationsFilter";
import ApplicationsStatusSummary from "./ApplicationsStatusSummary";
import ApplicationsTable from "./ApplicationsTable";
import { Job } from "@/types/Job";

type Props = {
  jobs: Job[];
};

function ApplicationsListingWrapper({ jobs }: Props) {
  return (
    <ApplicationsProvider jobs={jobs}>
      <ApplicationsFilter />
      <ApplicationsStatusSummary />
      <ApplicationsTable />
    </ApplicationsProvider>
  );
}

export default ApplicationsListingWrapper;
