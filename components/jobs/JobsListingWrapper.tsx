"use client";

import ClientPageHeader from "../common/ClientPageHeader";
import { JobsData } from "@/data";
import FilterSidebar from "./FilterSidebar";
import JobCards from "./JobCards";
import JobsProvider from "@/context/jobs/JobsProvider";

function JobsListingWrapper() {
  return (
    <JobsProvider>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ClientPageHeader
          title="ALL POSITIONS"
          subtitle={`${JobsData.length} OPEN ROLES`}
        />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
          <FilterSidebar />
          <JobCards />
        </div>
      </div>
    </JobsProvider>
  );
}

export default JobsListingWrapper;
