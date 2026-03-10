import { User, Mail, Briefcase, MapPin, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AiScore } from "../BrutalUI";
import { useUsers } from "@/context/users/UsersContext";
import { getCandidateApplications } from "@/utils";
import Link from "next/link";

function UsersList() {
  const {
    filteredCandidates,
    applications,
    expandedUser,
    setExpandedUser,
    jobs,
  } = useUsers();
  return (
    <div className="mt-6 space-y-0">
      {filteredCandidates.length === 0 ? (
        <div className="brutal-border p-12 text-center">
          <User size={32} className="mx-auto text-muted-foreground" />
          <p className="font-heading text-xl font-bold mt-4">NO USERS FOUND</p>
          <p className="font-mono text-xs text-muted-foreground mt-2">
            TRY A DIFFERENT SEARCH
          </p>
        </div>
      ) : (
        filteredCandidates.map((user) => {
          const userApps = getCandidateApplications(user.id, applications);
          const userAvgScore =
            userApps.length > 0
              ? Math.round(
                  (userApps.reduce((s, a) => s + a.aiScore, 0) /
                    userApps.length) *
                    10,
                ) / 10
              : 0;
          return (
            <div
              key={user.id}
              className="brutal-border border-b-0 last:border-b-3"
            >
              {/* User Row */}
              <button
                onClick={() =>
                  setExpandedUser(expandedUser === user.id ? null : user.id)
                }
                className="w-full grid grid-cols-[auto_2fr_2fr_1fr_1fr_auto] items-center px-6 py-5 text-left hover:bg-muted transition-none"
              >
                <div className="w-10 h-10 brutal-border bg-foreground text-background flex items-center justify-center font-heading text-sm font-bold mr-4">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-heading text-sm font-bold">{user.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                    <Mail size={10} /> {user.email}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Briefcase size={12} className="text-muted-foreground" />
                    <span className="font-mono text-xs">
                      {userApps.length} APP{userApps.length !== 1 ? "S" : ""}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-muted-foreground" />
                    <span className="font-mono text-[10px]">
                      {user.location}
                    </span>
                  </span>
                </div>
                <AiScore score={userAvgScore} size="sm" />
                <p className="font-mono text-xs text-muted-foreground">
                  {user.experience}
                </p>
                <span
                  className={`font-mono text-xs transition-none ${expandedUser === user.id ? "rotate-90" : ""}`}
                >
                  ▶
                </span>
              </button>

              {/* Expanded Applications */}
              {expandedUser === user.id && (
                <div className="border-t-3 border-foreground bg-muted">
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] px-6 py-2 bg-foreground/5">
                    <span className="font-heading text-[10px] font-bold text-muted-foreground">
                      JOB
                    </span>
                    <span className="font-heading text-[10px] font-bold text-muted-foreground">
                      DATE
                    </span>
                    <span className="font-heading text-[10px] font-bold text-muted-foreground">
                      SCORE
                    </span>
                    <span className="font-heading text-[10px] font-bold text-muted-foreground">
                      STATUS
                    </span>
                    <span className="font-heading text-[10px] font-bold text-muted-foreground">
                      VIEW
                    </span>
                  </div>
                  {userApps.length === 0 ? (
                    <div className="px-6 py-4 text-center">
                      <p className="font-mono text-xs text-muted-foreground">
                        NO APPLICATIONS YET
                      </p>
                    </div>
                  ) : (
                    userApps.map((app) => {
                      const job = jobs.find((j) => j.id === app.jobId);
                      const statusVariant = app.status.toLowerCase() as
                        | "submitted"
                        | "review"
                        | "shortlist"
                        | "interview"
                        | "rejected";
                      return (
                        <div
                          key={app.id}
                          className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] px-6 py-3 border-t border-foreground/20 items-center"
                        >
                          <div>
                            <p className="font-mono text-xs font-bold">
                              {job?.title || "—"}
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground">
                              {job?.company}
                            </p>
                          </div>
                          <p className="font-mono text-xs">{app.appliedDate}</p>
                          <AiScore score={app.aiScore} size="sm" />
                          <Badge variant={statusVariant}>{app.status}</Badge>
                          <Link href={`/admin/candidates/${user.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="VIEW DETAILS"
                            >
                              <ArrowUpRight size={14} />
                            </Button>
                          </Link>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default UsersList;
