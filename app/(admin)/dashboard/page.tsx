import { ApplicationsData } from "@/data/ApplicationsData";
import { JobsData } from "@/data/JobsData";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentApplications from "@/components/dashboard/RecentApplications";

function DashboardPage() {
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
        activeJobs={JobsData.length}
        totalCandidates={ApplicationsData.length}
        avgScore={avgScore}
        interviews={interviews}
      />
      <RecentApplications applications={ApplicationsData} />
    </>
  );
}

export default DashboardPage;
