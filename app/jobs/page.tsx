import Link from "next/link";


function JobsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Jobs</h1>
            <div className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-md p-4">
                <h2 className="text-2xl font-bold">Frontend Engineer</h2>
                <p className="text-gray-500">Remote Position</p>
                <Link className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" href="/jobs/1">View Job</Link>
            </div>
        </div>
    );
}

export default JobsPage;