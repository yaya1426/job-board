import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Filter } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useApplications } from "@/context/applications/ApplicationsContext";
import { StatusFilters } from "@/types";

function ApplicationsFilter() {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    jobFilter,
    setJobFilter,
    jobs,
  } = useApplications();

  return (
    <div className="mt-6 flex flex-col lg:flex-row gap-0">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
        />
        <Input
          placeholder="SEARCH BY NAME, EMAIL, ROLE..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="brutal-border border-l-0 lg:border-l-0 flex items-center">
        <Filter size={14} className="ml-3 text-muted-foreground" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-transparent font-mono text-xs font-bold px-3 py-3 outline-none cursor-pointer"
        >
          {StatusFilters.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="brutal-border border-l-0 flex items-center">
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="bg-transparent font-mono text-xs font-bold px-3 py-3 outline-none cursor-pointer"
        >
          <option value="ALL">ALL JOBS</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="mr-3 text-muted-foreground" />
      </div>
    </div>
  );
}

export default ApplicationsFilter;
