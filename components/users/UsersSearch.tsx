import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useUsers } from "@/context/users/UsersContext";

function UsersSearch() {
  const { search, setSearch } = useUsers();
  return (
    <div className="mt-6 relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={16}
      />
      <Input
        placeholder="SEARCH USERS BY NAME OR EMAIL..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}

export default UsersSearch;
