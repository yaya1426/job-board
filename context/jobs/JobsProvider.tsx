import { useState } from "react";
import JobsContext from "./JobsContext";
import { Job } from "@/types/Job";


const JobsProvider = ({ jobs = [], children }: { jobs: Job[], children: React.ReactNode }) => {
    const [jobState] = useState<Job[]>(jobs);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [locationFilter, setLocationFilter] = useState("ALL");

    
    return (
        <JobsContext.Provider value={{ jobs: jobState, search, setSearch, typeFilter, setTypeFilter, locationFilter, setLocationFilter }}>
            {children}
        </JobsContext.Provider>
    )
}

export default JobsProvider;