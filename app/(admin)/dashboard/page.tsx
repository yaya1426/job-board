import { ApplicationsData } from "@/data/ApplicationsData";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentApplications from "@/components/dashboard/RecentApplications";
import { getJobs } from "@/services/jobs/jobs.service";

async function DashboardPage() {
  const result = await getJobs();

  if (!result.success) {
    return <div>Error loading jobs</div>;
  }

  const { data: jobs = [] } = result;
  
  const interviews = ApplicationsData.filter(
    (c) => c.status === "INTERVIEW",
  ).length;

  const avgScore = (
    ApplicationsData.reduce((s, c) => s + c.aiScore, 0) /
    ApplicationsData.length
  ).toFixed(1);

  return (
    <>
      <h1 className="text-4xl font-heading font-bold">OVERVIEW</h1>
      <p className="font-mono text-sm text-muted-foreground mt-1">
        ADMIN DASHBOARD
      </p>

      <DashboardStats
        activeJobs={jobs.length}
        totalCandidates={ApplicationsData.length}
        avgScore={avgScore}
        interviews={interviews}
      />
      <RecentApplications applications={ApplicationsData} />
    </>
  );
}

export default DashboardPage;
