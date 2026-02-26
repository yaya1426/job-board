import Link from "next/link";

function ApplicationsPage() {
    return (
        <div>
            <h1>Applications</h1>
            <Link className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" href="/dashboard/applications/1">Application 1</Link>
            <Link className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" href="/dashboard/applications/2">Application 2</Link>
            <Link className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" href="/dashboard/applications/3">Application 3</Link>
        </div>
    )
}

export default ApplicationsPage;