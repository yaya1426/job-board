import { Button } from "../ui/button";
import { Job } from "@/types/Job";

type Props = {
  jobs: Job[];
}

function JobManagementTable({ jobs}: Props) {
  return (
    <div className="mt-8 brutal-border overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-foreground text-background">
            <th className="text-left font-heading text-xs font-bold px-4 py-3 border-r-3 border-background">
              TITLE
            </th>
            <th className="text-left font-heading text-xs font-bold px-4 py-3 border-r-3 border-background">
              COMPANY
            </th>
            <th className="text-left font-heading text-xs font-bold px-4 py-3 border-r-3 border-background">
              TYPE
            </th>
            <th className="text-left font-heading text-xs font-bold px-4 py-3 border-r-3 border-background">
              APPLICANTS
            </th>
            <th className="text-left font-heading text-xs font-bold px-4 py-3 border-r-3 border-background">
              POSTED
            </th>
            <th className="text-left font-heading text-xs font-bold px-4 py-3">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, i) => (
            <tr
              key={job.id}
              className={`${i > 0 ? "border-t-3 border-foreground" : ""} hover:bg-accent/10 transition-none`}
            >
              <td className="px-4 py-3 font-heading text-sm font-bold border-r-3">
                {job.title}
              </td>
              <td className="px-4 py-3 font-mono text-sm border-r-3">
                {job.company}
              </td>
              <td className="px-4 py-3 border-r-3">
                <span className="font-mono text-xs bg-accent text-accent-foreground px-2 py-0.5">
                  {job.type}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-sm font-bold border-r-3">
                {job.applicants}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground border-r-3">
                {job.posted}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="brutal-shadow-none shadow-none"
                  >
                    EDIT
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="border-l-0 brutal-shadow-none shadow-none"
                  >
                    DELETE
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobManagementTable;
