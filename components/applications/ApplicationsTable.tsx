import { Eye, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AiScore } from "../BrutalUI";
import { useApplications } from "@/context/applications/ApplicationsContext";

function ApplicationsTable() {
  const { filteredApplications } = useApplications();
  return (
    <div className="mt-6 brutal-border">
      <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] bg-foreground text-background px-4 py-3">
        <span className="font-heading text-xs font-bold">CANDIDATE</span>
        <span className="font-heading text-xs font-bold">APPLIED FOR</span>
        <span className="font-heading text-xs font-bold">DATE</span>
        <span className="font-heading text-xs font-bold">AI SCORE</span>
        <span className="font-heading text-xs font-bold">STATUS</span>
        <span className="font-heading text-xs font-bold text-right">
          ACTIONS
        </span>
      </div>
      {filteredApplications.length === 0 ? (
        <div className="p-12 text-center border-t-3 border-foreground">
          <p className="font-heading text-xl font-bold">
            NO APPLICATIONS FOUND
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-2">
            TRY ADJUSTING YOUR FILTERS
          </p>
        </div>
      ) : (
        filteredApplications.map((app) => {
          const statusVariant = app.status.toLowerCase() as
            | "submitted"
            | "review"
            | "shortlist"
            | "interview"
            | "rejected";
          return (
            <div
              key={app.id}
              className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] px-4 py-4 border-t-3 border-foreground items-center hover:bg-muted transition-none"
            >
              <div>
                <p className="font-heading text-sm font-bold">
                  {app?.candidateName || "—"}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {app?.candidateEmail}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs font-bold">
                  {app?.jobTitle || "—"}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {app?.jobCompany || "—"}
                </p>
              </div>
              <p className="font-mono text-xs">{app.appliedDate}</p>
              <AiScore score={app.aiScore} size="sm" />
              <Badge variant={statusVariant}>{app.status}</Badge>
              <div className="flex gap-1 justify-end">
                <Link href={`/admin/candidates/${app.candidateId}`}>
                  <Button variant="ghost" size="icon" title="VIEW">
                    <Eye size={14} />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" title="SHORTLIST">
                  <CheckCircle size={14} />
                </Button>
                <Button variant="ghost" size="icon" title="REJECT">
                  <XCircle size={14} />
                </Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ApplicationsTable;
