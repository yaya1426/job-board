"use client";
import { Input } from "../ui/input";
import { BrutalSelect } from "../BrutalUI";
import { Button } from "../ui/button";
import { useJobs } from "@/context/jobs/JobsContext";

function FilterSidebar() {
  const {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    locationFilter,
    setLocationFilter,
  } = useJobs();

  return (
    <div className="brutal-border p-6 space-y-6 lg:col-span-1">
      <h3 className="font-heading text-sm font-bold border-b-3 border-foreground pb-2">
        FILTERS
      </h3>
      <Input
        label="SEARCH"
        placeholder="ROLE, COMPANY, SKILL..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <BrutalSelect
        label="JOB TYPE"
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        options={[
          { value: "ALL", label: "ALL TYPES" },
          { value: "FULL-TIME", label: "FULL-TIME" },
          { value: "CONTRACT", label: "CONTRACT" },
          { value: "PART-TIME", label: "PART-TIME" },
        ]}
      />
      <BrutalSelect
        label="LOCATION"
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
        options={[
          { value: "ALL", label: "ALL LOCATIONS" },
          { value: "REMOTE", label: "REMOTE" },
          { value: "NEW YORK", label: "NEW YORK" },
          { value: "SAN FRANCISCO", label: "SAN FRANCISCO" },
          { value: "LONDON", label: "LONDON" },
          { value: "BERLIN", label: "BERLIN" },
        ]}
      />
      <Button variant="accent" className="w-full">
        APPLY FILTERS
      </Button>
    </div>
  );
}

export default FilterSidebar;
