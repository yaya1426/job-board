import Link from "next/link";
import { Button } from "../ui/button";

function JobNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 text-center">
      <h1 className="font-heading text-4xl font-bold">JOB NOT FOUND</h1>
      <Link href="/jobs">
        <Button variant="outline" className="mt-6">
          ← BACK TO JOBS
        </Button>
      </Link>
    </div>
  );
}

export default JobNotFound;
