import JobsListingWrapper from "@/components/jobs/JobsListingWrapper";
import { getJobs } from "@/services/jobs/jobs.service";

async function JobsPage() {
  const result = await getJobs();

  if (!result.success) {
    return <div>Error loading jobs</div>;
  }

  const { data: jobs = [] } = result;
  
  return <JobsListingWrapper jobs={jobs} />;
}

export default JobsPage;
