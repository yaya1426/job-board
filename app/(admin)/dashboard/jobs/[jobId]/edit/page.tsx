import Link from "next/link";

type Props = { 
    params: Promise<{ jobId: string }>;
};

async function EditJobPage({ params }: Props) {
    const { jobId } = await params;
    console.log(jobId);
    return (
        <div>
            <h1>Edit Job</h1>
            <Link className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" href={`/dashboard/jobs/${jobId}`}>Back to Job</Link>
        </div>
    )
}

export default EditJobPage;