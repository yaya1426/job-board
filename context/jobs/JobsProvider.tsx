import { useState } from "react";
import JobsContext from "./JobsContext";


const JobsProvider = ({ children }: { children: React.ReactNode }) => {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [locationFilter, setLocationFilter] = useState("ALL");
    
    return (
        <JobsContext.Provider value={{ search, setSearch, typeFilter, setTypeFilter, locationFilter, setLocationFilter }}>
            {children}
        </JobsContext.Provider>
    )
}

export default JobsProvider;