import Link from "next/link";

function NewJobPage() {
    return (
        <div>
            <h1>New Job</h1>
            <Link className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" href="/dashboard/jobs">Back to Jobs</Link>
        </div>
    )
}

export default NewJobPage;