import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Job Board</h1>
      <p className="text-lg">Welcome to Production App!</p>
      <Badge variant="destructive">Default</Badge>
    </div>
  );
}
