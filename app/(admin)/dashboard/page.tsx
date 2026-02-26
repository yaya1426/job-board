import Link from "next/link";


function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <Link className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" href="/dashboard/jobs">Jobs</Link>
            <Link className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" href="/dashboard/applications">Applications</Link>
        </div>
    );
}

export default DashboardPage;