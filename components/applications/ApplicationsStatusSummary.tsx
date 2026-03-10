import { useApplications } from "@/context/applications/ApplicationsContext";

function ApplicationsStatusSummary() {
  const { statusFilter, setStatusFilter, applications } = useApplications();

  return (
    <div className="grid grid-cols-5 gap-0 mt-6">
      {(
        ["SUBMITTED", "REVIEW", "SHORTLIST", "INTERVIEW", "REJECTED"] as const
      ).map((status) => {
        const count = applications.filter((a) => a.status === status).length;
        const colorMap: Record<string, string> = {
          SUBMITTED: "border-t-muted-foreground",
          REVIEW: "border-t-warning",
          SHORTLIST: "border-t-accent",
          INTERVIEW: "border-t-info",
          REJECTED: "border-t-destructive",
        };
        return (
          <button
            key={status}
            onClick={() =>
              setStatusFilter(statusFilter === status ? "ALL" : status)
            }
            className={`brutal-border border-t-[6px] ${colorMap[status]} p-4 text-left transition-none ${
              statusFilter === status ? "bg-accent/10" : "hover:bg-muted"
            }`}
          >
            <p className="font-mono text-2xl font-bold">{count}</p>
            <p className="font-mono text-[10px] text-muted-foreground mt-1">
              {status}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default ApplicationsStatusSummary;
