import { useUsers } from "@/context/users/UsersContext";

function UsersStats() {
  const { candidates, applications, avgScore } = useUsers();
  return (
    <div className="grid grid-cols-3 gap-0 mt-6">
      <div className="brutal-border p-6">
        <p className="font-mono text-3xl font-bold">{candidates.length}</p>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          TOTAL USERS
        </p>
      </div>
      <div className="brutal-border border-l-0 p-6">
        <p className="font-mono text-3xl font-bold">{applications.length}</p>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          TOTAL APPLICATIONS
        </p>
      </div>
      <div className="brutal-border border-l-0 p-6">
        <p className="font-mono text-3xl font-bold">{avgScore}</p>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          AVG AI SCORE
        </p>
      </div>
    </div>
  );
}

export default UsersStats;
