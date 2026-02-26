import Link from "next/link";

type Props = { 
    params: Promise<{ jobId: string }>;
};

async function JobDetailsPage({ params }: Props) {
    const { jobId } = await params;
    console.log(jobId);
    return (
        <div>
            <h1>Job Details</h1>
            <Link className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" href={`/dashboard/jobs/${jobId}/edit`}>Edit Job</Link>
            <Link className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" href={`/dashboard/jobs`}>Back to Jobs</Link>
        </div>
    )
}

export default JobDetailsPage;