import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Job Board</h1>
      <p className="text-lg">Welcome to Production App!</p>
      <Link className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" href="/jobs">Browse Jobs</Link>
    </div>
  );
}
